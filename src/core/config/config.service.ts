import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { EnvSchema } from './env.schema';

@Injectable()
export class ConfigService {
    constructor(private readonly config: NestConfigService<EnvSchema, true>) {}

    get nodeEnv() {
        return this.config.get('NODE_ENV', { infer: true });
    }

    get db() {
        return {
            type: this.config.get('DB_TYPE', { infer: true }),
            host: this.config.get('DB_HOST', { infer: true }),
            port: this.config.get('DB_PORT', { infer: true }),
            user: this.config.get('DB_USER', { infer: true }),
            password: this.config.get('DB_PASSWORD', { infer: true }),
            name: this.config.get('DB_NAME', { infer: true }),
        };
    }

    get redis() {
        return {
            host: this.config.get('REDIS_HOST', { infer: true }),
            port: this.config.get('REDIS_PORT', { infer: true }),
        };
    }
}
