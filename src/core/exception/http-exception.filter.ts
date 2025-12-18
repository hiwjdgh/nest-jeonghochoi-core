import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: LoggerService) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest<Request>();
        const res = ctx.getResponse<Response>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.message
                : 'Internal server error';

        // ⭐ 핵심: stack trace 확보
        const trace = exception instanceof Error ? exception.stack : undefined;

        // ⭐ 여기서 500 trace 로깅
        if (status >= 500) {
            this.logger.errorWithMeta(
                `HTTP ${req.method} ${req.originalUrl}`,
                {
                    statusCode: status,
                    method: req.method,
                    url: req.originalUrl,
                    stack: trace,
                },
                'ExceptionFilter',
            );
        }

        res.status(status).json({
            statusCode: status,
            message,
        });
    }
}
