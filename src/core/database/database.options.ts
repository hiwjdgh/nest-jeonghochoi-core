import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export type DatabaseExtraOptions = Omit<
    TypeOrmModuleOptions,
    'type' | 'host' | 'port' | 'username' | 'password' | 'database'
>;

export interface DatabaseOptions {
    enabled?: boolean;

    type: 'postgres' | 'mssql';
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;

    synchronize?: boolean;
    logging?: boolean;
    ssl?: boolean;

    /** 고급 사용자용 TypeORM override */
    extraOptions?: DatabaseExtraOptions;
}
