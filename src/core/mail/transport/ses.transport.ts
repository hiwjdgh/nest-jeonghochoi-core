import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { MailTransport } from './mail.transport.interface.js';
import { MailSendOptions } from '../mail.types.js';
import { SesConfig } from '../../config/schemas/mail.ses.schema.js';

export class SesTransport implements MailTransport {
    readonly name = 'ses';

    private client: SESClient;
    private readonly from: string;

    constructor(private readonly config: SesConfig) {
        this.from = config.from;

        this.client = new SESClient({
            region: config.region,
            credentials: config.credentials,
        });
    }

    async send(options: MailSendOptions) {
        const to = Array.isArray(options.to) ? options.to : [options.to];
        const cc = options.cc
            ? Array.isArray(options.cc)
                ? options.cc
                : [options.cc]
            : [];
        const bcc = options.bcc
            ? Array.isArray(options.bcc)
                ? options.bcc
                : [options.bcc]
            : [];

        await this.client.send(
            new SendEmailCommand({
                Source: options.from ?? this.from,
                Destination: {
                    ToAddresses: to,
                    CcAddresses: cc,
                    BccAddresses: bcc,
                },
                Message: {
                    Subject: { Data: options.subject },
                    Body: {
                        Html: { Data: options.html ?? '' },
                    },
                },
            })
        );
    }
}
