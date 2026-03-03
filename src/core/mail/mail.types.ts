export interface MailSendOptions {
    from?: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    html?: string;
    template?: string;
    data?: Record<string, any>;
}
