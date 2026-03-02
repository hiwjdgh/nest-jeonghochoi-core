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
});
