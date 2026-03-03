export type SesUploaderOPtions = {
    region: string;
    credentials: {
        accessKeyId: string;
        secretAccessKey: string;
    };
    from: string;
};

export type SmtpConfigSchema = {
    host: string;
    port: number;
    secure: string;
    user: string;
    password: string;
    from: string;
};

export type UploderDefinition = SesUploaderOPtions | SmtpConfigSchema;

export type UploderOptions = Record<string, UploderDefinition>;
