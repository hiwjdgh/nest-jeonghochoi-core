import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import type Redis from 'ioredis';
import { REDIS_CLIENT, REDIS_PUB, REDIS_SUB } from './redis.constants';

@Injectable()
export class RedisService implements OnModuleDestroy {
    constructor(
        @Inject(REDIS_CLIENT) private readonly client: Redis,
        @Inject(REDIS_PUB) private readonly pub: Redis,
        @Inject(REDIS_SUB) private readonly sub: Redis,
    ) {}

    getClient(): Redis {
        return this.client;
    }

    getPublisher(): Redis {
        return this.pub;
    }

    getSubscriber(): Redis {
        return this.sub;
    }

    async onModuleDestroy(): Promise<void> {
        await Promise.allSettled([
            this.client.quit(),
            this.pub.quit(),
            this.sub.quit(),
        ]);
    }
}
