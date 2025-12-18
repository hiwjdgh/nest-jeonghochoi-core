export interface LoggerOptions {
    enabled?: boolean;
    level?: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
    pretty?: boolean; // local/dev
    serviceName?: string;
}
