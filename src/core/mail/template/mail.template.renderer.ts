import Handlebars from 'handlebars';

export class MailTemplateRenderer {
    renderTemplate(source: string, context: Record<string, any>): string {
        const template = Handlebars.compile(source);
        return template(context);
    }
}
