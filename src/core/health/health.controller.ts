import { Controller, Get, Optional } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckService,
    TypeOrmHealthIndicator,
    HealthIndicatorFunction,
} from '@nestjs/terminus';
import { RedisService } from '../redis/redis.service';

@Controller('health')
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly db: TypeOrmHealthIndicator,
        @Optional() private readonly redis?: RedisService,
    ) {}

    @Get('live')
    liveness() {
        return { status: 'ok' };
    }

    @Get('ready')
    @HealthCheck()
    readiness() {
        const checks: HealthIndicatorFunction[] = [
            // ✅ 반드시 함수로 감싸기
            () => this.db.pingCheck('database'),
        ];

        const redis = this.redis;

        if (redis) {
            checks.push(async () => {
                await redis.getClient().ping();
                return {
                    redis: {
                        status: 'up',
                    },
                };
            });
        }

        return this.health.check(checks);
    }
}
