import { DataSourceOptions } from 'typeorm';

export type PostgresDatabaseDefinition = {
    enabled: boolean;
    type: 'postgres';
    supportsSchema: true;
    options: DataSourceOptions & {
        type: 'postgres';
        schema?: string;
    };
};

export type MssqlDatabaseDefinition = {
    enabled: boolean;
    type: 'mssql';
    supportsSchema: false;
    options: DataSourceOptions & {
        type: 'mssql';
    };
};

export type DatabaseDefinition =
    | PostgresDatabaseDefinition
    | MssqlDatabaseDefinition;
