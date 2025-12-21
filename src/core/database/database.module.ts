import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DatabaseRegistry } from './registry';
import { ConnectionCache } from './cache';
import { DatabaseConnectionResolver } from './resolver';

export const DATABASE_REGISTRY = Symbol('DATABASE_REGISTRY');

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

        return {
            module: DatabaseModule,
            providers: [registryProvider, cacheProvider, resolverProvider],
            exports: [DatabaseConnectionResolver],
        };
    }
}
