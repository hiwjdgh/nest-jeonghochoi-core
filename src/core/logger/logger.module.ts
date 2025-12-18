import { DynamicModule, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerOptions } from './logger.options';
import { RequestContextService } from '../request-context/request-context.service';

@Module({})
export class LoggerModule {
    static forRoot(options?: LoggerOptions): DynamicModule {
        if (options?.enabled === false) {
            return {
                module: LoggerModule,
                providers: [],
                exports: [],
            };
        }

        const resolved: Required<Pick<LoggerOptions, 'level' | 'pretty'>> &
            LoggerOptions = {
            level: options?.level ?? 'info',
            pretty: options?.pretty ?? false,
            serviceName: options?.serviceName,
        };

        return {
            module: LoggerModule,
            providers: [
                {
                    provide: LoggerService,
                    inject: [RequestContextService],
                    useFactory: (context: RequestContextService) =>
                        new LoggerService(
                            {
                                level: resolved.level,
                                pretty: resolved.pretty,
                                serviceName: resolved.serviceName,
                            },
                            context,
                        ),
                },
            ],
            exports: [LoggerService],
        };
    }
}
