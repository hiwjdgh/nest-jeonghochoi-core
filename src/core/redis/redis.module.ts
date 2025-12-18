import { DynamicModule, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT, REDIS_PUB, REDIS_SUB } from './redis.constants';
import { RedisOptions } from './redis.options';
import { RedisService } from './redis.service';

@Module({})
export class RedisModule {
    static forRoot(options?: RedisOptions): DynamicModule {
        if (!options) {
            throw new Error('[RedisModule] options are required');
        }

        if (!options.host) {
            throw new Error('[RedisModule] host is required');
        }

        if (!options.port) {
            throw new Error('[RedisModule] port is required');
        }

        const createClient = (): Redis => {
            return new Redis({
                host: options.host,
                port: options.port,
                password: options.password,
                db: options.db,
                keyPrefix: options.keyPrefix,
                enableReadyCheck: options.enableReadyCheck ?? true,
            });
        };

        return {
            module: RedisModule,
            providers: [
                {
                    provide: REDIS_CLIENT,
                    useFactory: createClient,
                },
                {
                    provide: REDIS_PUB,
                    useFactory: createClient,
                },
                {
                    provide: REDIS_SUB,
                    useFactory: createClient,
                },
                RedisService,
            ],
            exports: [RedisService],
        };
    }
}
