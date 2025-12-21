import { DataSource } from 'typeorm';

export class ConnectionCache {
    private readonly cache = new Map<string, DataSource>();

    get(key: string): DataSource | undefined {
        return this.cache.get(key);
    }

    set(key: string, ds: DataSource): void {
        this.cache.set(key, ds);
    }

    has(key: string): boolean {
        return this.cache.has(key);
    }
}
