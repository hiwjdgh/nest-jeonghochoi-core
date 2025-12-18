import { DynamicModule, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '../config/config.service';
import { REDIS_CLIENT, REDIS_PUB, REDIS_SUB } from './redis.constants';
import { RedisOptions } from './redis.options';
import { RedisService } from './redis.service';

@Module({})
export class RedisModule {
    static forRoot(options?: RedisOptions): DynamicModule {
        if (options?.enabled === false) {
            return {
                module: RedisModule,
                providers: [
                    {
                        provide: RedisService,
                        useValue: null,
                    },
                ],
                exports: [RedisService],
            };
        }

        const createClient = (config: ConfigService): Redis => {
            return new Redis({
                host: config.redis.host,
                port: config.redis.port,
                keyPrefix: options?.keyPrefix,
                enableReadyCheck: options?.enableReadyCheck ?? true,
            });
        };

        return {
            module: RedisModule,
            providers: [
                {
                    provide: REDIS_CLIENT,
                    inject: [ConfigService],
                    useFactory: (config: ConfigService): Redis =>
                        createClient(config),
                },
                {
                    provide: REDIS_PUB,
                    inject: [ConfigService],
                    useFactory: (config: ConfigService): Redis =>
                        createClient(config),
                },
                {
                    provide: REDIS_SUB,
                    inject: [ConfigService],
                    useFactory: (config: ConfigService): Redis =>
                        createClient(config),
                },
                RedisService,
            ],
            exports: [RedisService],
        };
    }
}
