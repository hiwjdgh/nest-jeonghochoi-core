import { DynamicModule, Global, Module } from '@nestjs/common';
import { MailService } from './mail.service.js';
import { MailOptions } from './mail.options.js';

import { MailTransportRegistry } from './transport/mail.transport.registry.js';
import { SmtpTransport } from './transport/smtp.transport.js';
import { SesTransport } from './transport/ses.transport.js';

import { MailTemplateLoader } from './template/mail.template.loader.js';
import { MailTemplateRenderer } from './template/mail.template.renderer.js';

@Global()
@Module({})
export class MailModule {
    static forRoot(options: MailOptions = {}): DynamicModule {
        const registry = new MailTransportRegistry();

        Object.entries(options.transports ?? {}).forEach(([name, config]) => {
            if (config.type === 'smtp') {
                registry.register(name, new SmtpTransport(config));
                return;
            }

            registry.register(name, new SesTransport(config));
        });

        return {
            module: MailModule,
            providers: [
                {
                    provide: MailTransportRegistry,
                    useValue: registry,
                },
                {
                    provide: MailTemplateLoader,
                    useFactory: () =>
                        new MailTemplateLoader(
                            options.templateDir ?? 'templates/mail',
                        ),
                },
                MailTemplateRenderer,
                MailService,
            ],
            exports: [MailService, MailTransportRegistry],
        };
    }
}
