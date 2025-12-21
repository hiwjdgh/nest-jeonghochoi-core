import { z } from 'zod';

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
            host: z.string(),
            port: z.number(),
        })
        .optional(),
    database: z
        .object({
            enabled: z.boolean().optional(),
            registry: z.object().optional(),
        })
        .optional(),
});
