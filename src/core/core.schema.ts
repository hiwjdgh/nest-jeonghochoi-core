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

const smtpTransportSchema = z.object({
    type: z.literal('smtp'),
    host: z.string(),
    port: z.coerce.number(),
    secure: z.boolean().optional(),
    user: z.string(),
    password: z.string(),
    from: z.string().optional(),
});

const sesTransportSchema = z.object({
    type: z.literal('ses'),
    region: z.string(),
    credentials: z.object({
        accessKeyId: z.string(),
        secretAccessKey: z.string(),
    }),
    from: z.string(),
});

const mailTransportSchema = z.union([smtpTransportSchema, sesTransportSchema]);

const csvWriterSchema = z.object({
    type: z.literal('csv'),
    path: z.string().optional(),
});

const excelWriterSchema = z.object({
    type: z.literal('excel'),
    path: z.string().optional(),
});

const writerSchema = z.union([csvWriterSchema, excelWriterSchema]);

const ftpUploaderSchema = z.object({
    type: z.literal('ftp'),
    host: z.string(),
    port: z.coerce.number().optional(),
    user: z.string(),
    password: z.string(),
    secure: z.boolean().optional(),
    basePath: z.string().optional(),
});

const s3UploaderSchema = z.object({
    type: z.literal('s3'),
    region: z.string(),
    bucket: z.string(),
    accessKeyId: z.string().optional(),
    secretAccessKey: z.string().optional(),
});

const localUploaderSchema = z.object({
    type: z.literal('local'),
    basePath: z.string().optional(),
});

const uploaderSchema = z.union([
    ftpUploaderSchema,
    s3UploaderSchema,
    localUploaderSchema,
]);

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
    file: z
        .object({
            enabled: z.boolean().optional(),
            uploader: z.record(z.string(), uploaderSchema).optional(),
            writer: z.record(z.string(), writerSchema).optional(),
        })
        .optional(),
    mail: z
        .object({
            enabled: z.boolean().optional(),
            templateDir: z.string().optional(),
            transports: z.record(z.string(), mailTransportSchema).optional(),
        })
        .optional(),
});
