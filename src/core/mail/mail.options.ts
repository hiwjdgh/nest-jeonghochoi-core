export interface SmtpMailTransportOptions {
    type: 'smtp';
    host: string;
    port: number;
    secure?: boolean;
    user: string;
    password: string;
    from?: string;
}

export interface SesMailTransportOptions {
    type: 'ses';
    region: string;
    credentials: {
        accessKeyId: string;
        secretAccessKey: string;
    };
    from: string;
}

export type MailTransportDefinition =
    | SmtpMailTransportOptions
    | SesMailTransportOptions;

export interface MailOptions {
    enabled?: boolean;
    templateDir?: string;
    transports?: Record<string, MailTransportDefinition>;
}
