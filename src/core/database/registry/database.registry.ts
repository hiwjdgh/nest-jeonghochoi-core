import { DatabaseDefinition } from '../contracts';

export type DatabaseRegistry = Record<
    string, // databaseKey
    DatabaseDefinition
>;
