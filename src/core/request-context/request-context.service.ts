import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
    requestId: string;
}

@Injectable()
export class RequestContextService {
    private readonly als = new AsyncLocalStorage<RequestContext>();

    run(context: RequestContext, fn: () => void) {
        this.als.run(context, fn);
    }

    get<T extends keyof RequestContext>(key: T): RequestContext[T] | undefined {
        return this.als.getStore()?.[key];
    }
}
