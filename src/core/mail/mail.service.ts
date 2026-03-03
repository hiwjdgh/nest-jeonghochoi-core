import { Injectable } from '@nestjs/common';
import { MailTransportRegistry } from './transport/mail.transport.registry.js';
import { MailTemplateLoader } from './template/mail.template.loader.js';
import { MailTemplateRenderer } from './template/mail.template.renderer.js';
import { MailSendOptions } from './mail.types.js';

@Injectable()
export class MailService {
    constructor(
        private readonly transports: MailTransportRegistry,
        private readonly templateLoader: MailTemplateLoader,
        private readonly templateRenderer: MailTemplateRenderer
    ) {}

    async send(
        transport: 'smtp' | 'ses',
        templateName: string,
        context: Record<string, any>,
        options: Omit<MailSendOptions, 'html'>
    ) {
        const source = await this.templateLoader.loadTemplate(templateName);

        const html = this.templateRenderer.renderTemplate(source, context);

        await this.transports.use(transport).send({
            ...options,
            html,
        });
    }
}
