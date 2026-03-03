import { z } from 'zod';

const jwtSignOptionsSchema = z
    .object({
        algorithm: z.string().optional(),
        expiresIn: z.union([z.string(), z.number()]).optional(),
        notBefore: z.union([z.string(), z.number()]).optional(),
        audience: z.union([z.string(), z.array(z.string())]).optional(),
        issuer: z.string().optional(),
        subject: z.string().optional(),
        jwtid: z.string().optional(),
        noTimestamp: z.boolean().optional(),
        header: z.record(z.string(), z.unknown()).optional(),
        keyid: z.string().optional(),
    })
    .partial();

const postgresDefinitionSchema = z.object({
    enabled: z.boolean(),
    type: z.literal('postgres'),
    supportsSchema: z.literal(true),
    options: z
        .object({
            type: z.literal('postgres'),
            schema: z.string().optional(),
        })
        .passthrough(),
});

const mssqlDefinitionSchema = z.object({
    enabled: z.boolean(),
    type: z.literal('mssql'),
    supportsSchema: z.literal(false),
    options: z
        .object({
            type: z.literal('mssql'),
        })
        .passthrough(),
});

const databaseDefinitionSchema = z.union([
    postgresDefinitionSchema,
    mssqlDefinitionSchema,
]);

const SesConfigSchema = z.object({
    region: z.string(),
    credentials: z.object({
        accessKeyId: z.string(),
        secretAccessKey: z.string(),
    }),
    from: z.string(),
});

const SmtpConfigSchema = z.object({
    host: z.string(),
    port: z.coerce.number(),
    secure: z.boolean().default(false),
    user: z.string(),
    password: z.string(),
    from: z.string(),
});

const MailSchema = z.union([SesConfigSchema, SmtpConfigSchema]);

const CsvConfigScema = z.object({
    path: z.string(),
});

const ExcelConfigScema = z.object({
    path: z.string(),
});

const FileWriterSchema = z.union([CsvConfigScema, ExcelConfigScema]);

const FtpConfigSchema = z.object({
    host: z.string(),
    port: z.coerce.number().default(21),
    user: z.string(),
    password: z.string(),
    secure: z.boolean().default(false),
    basePath: z.string().optional(),
});

const S3ConfigSchema = z.object({
    region: z.string(),
    bucket: z.string(),
    accessKeyId: z.string().optional(),
    secretAccessKey: z.string().optional(),
});

const FileUploaderSchema = z.union([FtpConfigSchema, S3ConfigSchema]);

export const coreOptionsSchema = z.object({
    logger: z
        .object({
            enabled: z.boolean().optional(),
            appName: z.string().min(1),
        })
        .optional(),

    redis: z
        .object({
            enabled: z.boolean().optional(),
            host: z.string().min(1),
            port: z.number().int().min(1).max(65535),
        })
        .optional(),

    database: z
        .object({
            enabled: z.boolean().optional(),
            registry: z.record(z.string(), databaseDefinitionSchema).optional(),
        })
        .optional(),

    jwt: z
        .object({
            enabled: z.boolean().optional(),
            secret: z.string().min(1),
            signOptions: jwtSignOptionsSchema.optional(),
        })
        .optional(),

    rbac: z
        .object({
            enabled: z.boolean().optional(),
            contextProvider: z.custom<object>().optional(),
            permissionChecker: z.custom<object>().optional(),
        })
        .optional(),

    file: z.object({
        enable: z.boolean().optional(),
        uploader: z.record(z.string(), FileUploaderSchema).optional(),
        writer: z.record(z.string(), FileWriterSchema).optional,
    }),

    mail: z.object({
        enable: z.boolean().optional(),
        registry: z.record(z.string(), MailSchema).optional(),
    }),
});
