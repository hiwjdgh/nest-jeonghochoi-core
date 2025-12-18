import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { RequestContextService } from './request-context.service';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
    constructor(private readonly context: RequestContextService) {}

    use(req: Request, res: Response, next: NextFunction) {
        const requestId =
            (req.headers['x-request-id'] as string) ?? randomUUID();

        res.setHeader('x-request-id', requestId);

        this.context.run({ requestId }, next);
    }
}
