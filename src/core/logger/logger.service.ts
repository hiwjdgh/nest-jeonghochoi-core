import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import pino, { Logger as PinoLogger } from 'pino';
import { RequestContextService } from '../request-context/request-context.service';

@Injectable()
export class LoggerService implements NestLoggerService {
    private readonly logger: PinoLogger;

    constructor(
        options: {
            level: string;
            pretty: boolean;
            serviceName?: string;
        },
        private readonly context: RequestContextService,
    ) {
        this.logger = pino({
            level: options.level,
            base: {
                service: options.serviceName,
            },
        });
    }

    private enrich() {
        return {
            requestId: this.context.get('requestId'),
        };
    }

    log(message: string, context?: string) {
        this.logger.info({ ...this.enrich(), context }, message);
    }

    error(message: string, trace?: string, context?: string) {
        this.logger.error({ ...this.enrich(), context, trace }, message);
    }

    warn(message: string, context?: string) {
        this.logger.warn({ ...this.enrich(), context }, message);
    }

    debug(message: string, context?: string) {
        this.logger.debug({ ...this.enrich(), context }, message);
    }

    verbose(message: string, context?: string) {
        this.logger.trace({ ...this.enrich(), context }, message);
    }

    logWithMeta(
        message: string,
        meta: Record<string, unknown>,
        context?: string,
    ) {
        this.logger.info(
            {
                ...this.enrich(),
                context,
                ...meta,
            },
            message,
        );
    }

    warnWithMeta(
        message: string,
        meta: Record<string, unknown>,
        context?: string,
    ) {
        this.logger.warn(
            {
                ...this.enrich(),
                context,
                ...meta,
            },
            message,
        );
    }

    errorWithMeta(
        message: string,
        meta: Record<string, unknown>,
        context?: string,
    ) {
        this.logger.error(
            {
                ...this.enrich(),
                context,
                ...meta,
            },
            message,
        );
    }
}
