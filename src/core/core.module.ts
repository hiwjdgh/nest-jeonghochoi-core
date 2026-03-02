import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import {
    DynamicModule,
    Global,
    MiddlewareConsumer,
    Module,
    NestModule,
} from '@nestjs/common';
import { LoggerModule } from './logger';
import { DatabaseModule } from './database';
import { RedisModule } from './redis';
import { RequestContextMiddleware } from './request-context/request-context.middleware';
import { HttpLoggerMiddleware } from './http-logger/http-logger.middleware';
import { HealthModule } from './health/health.module';
import { RequestContextService } from './request-context/request-context.service';
import { CoreOptions } from './core.options';
import { coreOptionsSchema } from './core.schema';
import { JwtModule } from './jwt';
import { RbacModule } from './rbac';

@Global()
@Module({
    providers: [
        RequestContextService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
    exports: [RequestContextService],
})
export class CoreModule implements NestModule {
    static forRoot(options: CoreOptions = {}): DynamicModule {
        const parsed = coreOptionsSchema.parse(options) as CoreOptions;
        const imports: DynamicModule['imports'] = [];
        const exports: DynamicModule['exports'] = [];

        // Logger (필수)
        if (parsed.logger) {
            imports.push(LoggerModule.forRoot(parsed.logger));
            exports.push(LoggerModule);
        }

        // Redis (선택)
        if (parsed.redis?.enabled !== false) {
            if (parsed.redis) {
                imports.push(RedisModule.forRoot(parsed.redis));
                exports.push(RedisModule);
            }
        }

        // Database (선택)
        if (parsed.database?.enabled !== false) {
            if (parsed.database?.registry) {
                imports.push(DatabaseModule.forRoot(parsed.database.registry));
                exports.push(DatabaseModule);
            }
        }

        // JWT (선택)
        if (parsed.jwt?.enabled !== false) {
            if (parsed.jwt) {
                imports.push(
                    JwtModule.forRoot({
                        secret: parsed.jwt.secret,
                        signOptions: parsed.jwt.signOptions,
                    }),
                );
                exports.push(JwtModule);
            }
        }

        // RBAC (선택)
        if (parsed.rbac?.enabled !== false) {
            if (parsed.rbac) {
                imports.push(
                    RbacModule.forRoot({
                        contextProvider: parsed.rbac.contextProvider,
                        permissionChecker: parsed.rbac.permissionChecker,
                    }),
                );
                exports.push(RbacModule);
            }
        }

        return {
            module: CoreModule,
            global: true,
            imports: [HealthModule, ...imports],
            exports: [...exports],
        };
    }

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RequestContextMiddleware, HttpLoggerMiddleware)
            .forRoutes('*');
    }
}
