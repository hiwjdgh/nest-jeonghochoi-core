import nodemailer, { Transporter } from 'nodemailer';
import { MailTransport } from './mail.transport.interface.js';
import { MailSendOptions } from '../mail.types.js';
import { SmtpConfig } from '../../config/schemas/mail.smtp.schema.js';

export class SmtpTransport implements MailTransport {
    readonly name = 'smtp';

    private readonly transporter: Transporter;
    private readonly from?: string;

    constructor(private readonly config: SmtpConfig) {
        this.from = config.from;

        this.transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure ?? config.port === 465,
            auth: {
                user: config.user,
                pass: config.password,
            },
        });
    }

    async send(options: MailSendOptions) {
        await this.transporter.sendMail({
            from: options.from ?? this.from,
            to: options.to,
            cc: options.cc,
            subject: options.subject,
            html: options.html,
        });
    }
}
