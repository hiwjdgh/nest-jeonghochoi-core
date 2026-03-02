import { DataSource } from 'typeorm';
import { DatabaseRequestContext, DatabaseDefinition } from '../contracts';
import { DatabaseRegistry } from '../registry';
import { ConnectionCache } from '../cache';

export class DatabaseConnectionResolver {
    private readonly inFlight = new Map<string, Promise<DataSource>>();

    constructor(
        private readonly registry: DatabaseRegistry,
        private readonly cache: ConnectionCache,
    ) {}

    async resolve(ctx: DatabaseRequestContext): Promise<DataSource> {
        const definition = this.registry[ctx.databaseKey];

        if (!definition) {
            throw new Error(`Unknown databaseKey: ${ctx.databaseKey}`);
        }

        if (!definition.enabled) {
            throw new Error(`Database "${ctx.databaseKey}" is disabled`);
        }

        const cacheKey = this.buildCacheKey(ctx);

        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }

        const existingInFlight = this.inFlight.get(cacheKey);
        if (existingInFlight) {
            return existingInFlight;
        }

        const dsPromise = this.createDataSource(definition, ctx.schema)
            .then((ds) => {
                this.cache.set(cacheKey, ds);
                return ds;
            })
            .finally(() => {
                this.inFlight.delete(cacheKey);
            });

        this.inFlight.set(cacheKey, dsPromise);
        return dsPromise;
    }

    private buildCacheKey(ctx: DatabaseRequestContext): string {
        return `${ctx.databaseKey}:${ctx.schema ?? 'default'}`;
    }

    private async createDataSource(
        def: DatabaseDefinition,
        schema?: string,
    ): Promise<DataSource> {
        const options = { ...def.options };

        if (def.type === 'postgres' && schema) {
            options.schema = schema;
        }

        const ds = new DataSource(options);
        await ds.initialize();

        return ds;
    }
}
