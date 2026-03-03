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
import { FileModule } from './file/file.module.js';
import { MailModule } from './mail/mail.module.js';

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

        if (parsed.logger) {
            imports.push(LoggerModule.forRoot(parsed.logger));
            exports.push(LoggerModule);
        }

        if (parsed.redis?.enabled !== false && parsed.redis) {
            imports.push(RedisModule.forRoot(parsed.redis));
            exports.push(RedisModule);
        }

        if (parsed.database?.enabled !== false && parsed.database?.registry) {
            imports.push(DatabaseModule.forRoot(parsed.database.registry));
            exports.push(DatabaseModule);
        }

        if (parsed.jwt?.enabled !== false && parsed.jwt) {
            imports.push(
                JwtModule.forRoot({
                    secret: parsed.jwt.secret,
                    signOptions: parsed.jwt.signOptions,
                }),
            );
            exports.push(JwtModule);
        }

        if (parsed.rbac?.enabled !== false && parsed.rbac) {
            imports.push(
                RbacModule.forRoot({
                    contextProvider: parsed.rbac.contextProvider,
                    permissionChecker: parsed.rbac.permissionChecker,
                }),
            );
            exports.push(RbacModule);
        }

        if (parsed.file?.enabled !== false && parsed.file) {
            imports.push(FileModule.forRoot(parsed.file));
            exports.push(FileModule);
        }

        if (parsed.mail?.enabled !== false && parsed.mail) {
            imports.push(MailModule.forRoot(parsed.mail));
            exports.push(MailModule);
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
