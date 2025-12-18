import { z } from 'zod';

export const coreOptionsSchema = z.object({
    logger: z
        .object({
            enabled: z.boolean().optional(),
            serviceName: z.string().min(1),
        })
        .optional(),

    redis: z
        .object({
            enabled: z.boolean().optional(),
            host: z.string(),
            port: z.number(),
        })
        .optional(),

    database: z
        .object({
            enabled: z.boolean().optional(),
            type: z.enum(['postgres', 'mssql']),
            host: z.string(),
            port: z.number(),
            username: z.string(),
            password: z.string(),
            database: z.string(),
        })
        .optional(),
});
