import { MailSendOptions } from '../mail.types.js';

export interface MailTransport {
    readonly name: string;
    send(options: MailSendOptions): Promise<void>;
}
