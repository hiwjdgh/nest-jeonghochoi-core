import { Global, Module } from '@nestjs/common';
import { CoreConfigService } from '../config';
import { MailService } from './mail.service';

import { MailTransportRegistry } from './transport/mail.transport.registry';
import { SmtpTransport } from './transport/smtp.transport';
import { SesTransport } from './transport/ses.transport';

import { MailTemplateLoader } from './template/mail.template.loader';
import { MailTemplateRenderer } from './template/mail.template.renderer';

@Global()
@Module({
    providers: [
        // transport registry
        MailTransportRegistry,

        // template loader (dir 주입 지점)
        {
            provide: MailTemplateLoader,
            inject: [CoreConfigService],
            useFactory: (config: CoreConfigService<any>) =>
                new MailTemplateLoader(config.get().mailTemplateDir),
        },

        // template renderer (순수)
        MailTemplateRenderer,

        // transport 초기화 (side-effect)
        {
            provide: 'MAIL_TRANSPORTS_INIT',
            inject: [CoreConfigService, MailTransportRegistry],
            useFactory: (
                config: CoreConfigService<any>,
                registry: MailTransportRegistry
            ) => {
                const mailConfig = config.get();

                if (mailConfig.smtp) {
                    registry.register(
                        'smtp',
                        new SmtpTransport(mailConfig.smtp)
                    );
                }

                if (mailConfig.ses) {
                    registry.register('ses', new SesTransport(mailConfig.ses));
                }

                if (!mailConfig.smtp && !mailConfig.ses) {
                    throw new Error('No mail transport configured');
                }
            },
        },

        // MailService (이제 config 필요 없음)
        MailService,
    ],
    exports: [MailService],
})
export class MailModule {}
