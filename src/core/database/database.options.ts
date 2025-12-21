import { DatabaseRegistry } from './registry';

export interface DatabaseOptions {
    enabled?: boolean;
    registry: DatabaseRegistry;
}
