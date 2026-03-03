export interface FtpUploaderOptions {
    type: 'ftp';
    host: string;
    port?: number;
    user: string;
    password: string;
    secure?: boolean;
    basePath?: string;
}

export interface S3UploaderOptions {
    type: 's3';
    region: string;
    bucket: string;
    accessKeyId?: string;
    secretAccessKey?: string;
}

export interface LocalUploaderOptions {
    type: 'local';
    basePath?: string;
}

export type UploaderDefinition =
    | FtpUploaderOptions
    | S3UploaderOptions
    | LocalUploaderOptions;

export type UploaderOptions = Record<string, UploaderDefinition>;
