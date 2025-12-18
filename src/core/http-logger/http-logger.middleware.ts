import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
    constructor(private readonly logger: LoggerService) {}

    use(req: Request, res: Response, next: NextFunction) {
        const start = Date.now();

        res.on('finish', () => {
            const ignore = ['/favicon.ico', '/.well-known'];

            if (ignore.some((p) => req.originalUrl.startsWith(p))) {
                return;
            }

            const duration = Date.now() - start;

            const meta = {
                method: req.method,
                url: req.originalUrl,
                statusCode: res.statusCode,
                durationMs: duration,
                userAgent: req.headers['user-agent'],
            };

            if (res.statusCode >= 500) {
                this.logger.errorWithMeta(
                    `HTTP ${req.method} ${req.originalUrl}`,
                    meta,
                    'HttpLogger',
                );
            } else if (res.statusCode >= 400) {
                this.logger.warnWithMeta(
                    `HTTP ${req.method} ${req.originalUrl}`,
                    meta,
                    'HttpLogger',
                );
            } else {
                this.logger.logWithMeta(
                    `HTTP ${req.method} ${req.originalUrl}`,
                    meta,
                    'HttpLogger',
                );
            }
        });

        next();
    }
}
