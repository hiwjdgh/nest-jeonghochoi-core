export interface LoggerOptions {
    level?: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
    pretty?: boolean; // local/dev
    appName: string;
}
