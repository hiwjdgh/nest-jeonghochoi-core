import { z } from 'zod';

export const envSchema = z.object({
    NODE_ENV: z.enum(['local', 'dev', 'prod']).default('local'),

    DB_TYPE: z.enum(['postgres', 'mssql']),

    DB_HOST: z.string(),
    DB_PORT: z.coerce.number(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string().optional().default(''),
    DB_NAME: z.string(),

    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number().default(6379),
});

export type EnvSchema = z.infer<typeof envSchema>;
