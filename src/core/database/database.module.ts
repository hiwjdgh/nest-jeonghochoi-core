import {
    DynamicModule,
    Module,
    OnModuleDestroy,
    Provider,
} from '@nestjs/common';
import { DatabaseRegistry } from './registry';
import { ConnectionCache } from './cache';
import { DatabaseConnectionResolver } from './resolver';

export const DATABASE_REGISTRY = Symbol('DATABASE_REGISTRY');

export const DATABASE_CONNECTION_CLEANUP = Symbol('DATABASE_CONNECTION_CLEANUP');

class DatabaseConnectionCleanupService implements OnModuleDestroy {
    constructor(private readonly cache: ConnectionCache) {}

    async onModuleDestroy(): Promise<void> {
        const destroyTargets = this.cache
            .values()
            .filter((ds) => ds.isInitialized)
            .map((ds) => ds.destroy());

        await Promise.allSettled(destroyTargets);
        this.cache.clear();
    }
}

@Module({})
export class DatabaseModule {
    static forRoot(registry: DatabaseRegistry): DynamicModule {
        const registryProvider: Provider = {
            provide: DATABASE_REGISTRY,
            useValue: registry,
        };

        const cacheProvider: Provider = {
            provide: ConnectionCache,
            useClass: ConnectionCache,
        };

        const resolverProvider: Provider = {
            provide: DatabaseConnectionResolver,
            useFactory: (
                registry: DatabaseRegistry,
                cache: ConnectionCache,
            ) => {
                return new DatabaseConnectionResolver(registry, cache);
            },
            inject: [DATABASE_REGISTRY, ConnectionCache],
        };

        const cleanupProvider: Provider = {
            provide: DATABASE_CONNECTION_CLEANUP,
            useFactory: (cache: ConnectionCache) =>
                new DatabaseConnectionCleanupService(cache),
            inject: [ConnectionCache],
        };

        return {
            module: DatabaseModule,
            providers: [
                registryProvider,
                cacheProvider,
                resolverProvider,
                cleanupProvider,
            ],
            exports: [DatabaseConnectionResolver],
        };
    }
}
