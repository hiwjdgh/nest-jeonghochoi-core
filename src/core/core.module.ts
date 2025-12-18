import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import {
    DynamicModule,
    Global,
    MiddlewareConsumer,
    Module,
    NestModule,
} from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { LoggerModule, LoggerOptions } from './logger';
import { DatabaseModule, DatabaseOptions } from './database';
import { RedisModule, RedisOptions } from './redis';
import { RequestContextMiddleware } from './request-context/request-context.middleware';
import { HttpLoggerMiddleware } from './http-logger/http-logger.middleware';
import { HealthModule } from './health/health.module';
import { RequestContextService } from './request-context/request-context.service';

export interface CoreModuleOptions {
    database?: DatabaseOptions;
    redis?: RedisOptions;
    logger?: LoggerOptions;
}

@Global()
@Module({
    providers: [
        ConfigService,
        RequestContextService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
    exports: [ConfigService, RequestContextService],
})
export class CoreModule implements NestModule {
    static forRoot(options?: CoreModuleOptions): DynamicModule {
        return {
            module: CoreModule,
            global: true,
            imports: [
                ConfigModule,
                DatabaseModule.forRoot(options?.database),
                RedisModule.forRoot(options?.redis),
                LoggerModule.forRoot(options?.logger),
                HealthModule,
            ],
            exports: [DatabaseModule, RedisModule, LoggerModule],
        };
    }

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RequestContextMiddleware, HttpLoggerMiddleware)
            .forRoutes('*');
    }
}
