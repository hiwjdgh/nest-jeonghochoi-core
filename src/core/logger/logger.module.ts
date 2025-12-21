import { DynamicModule, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerOptions } from './logger.options';
import { RequestContextService } from '../request-context/request-context.service';

@Module({})
export class LoggerModule {
    static forRoot(options?: LoggerOptions): DynamicModule {
        if (!options) {
            throw new Error('[LoggerOptions] options are required');
        }

        if (!options.appName) {
            throw new Error('[LoggerOptions] appName is required');
        }

        const resolved = {
            level: options.level ?? 'info',
            pretty: options.pretty ?? false,
            appName: options.appName,
        };

        return {
            module: LoggerModule,
            providers: [
                {
                    provide: LoggerService,
                    inject: [RequestContextService],
                    useFactory: (context: RequestContextService) =>
                        new LoggerService(resolved, context),
                },
            ],
            exports: [LoggerService],
        };
    }
}
