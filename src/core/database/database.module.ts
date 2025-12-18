import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseOptions } from './database.options';

@Module({})
export class DatabaseModule {
    static forRoot(options: DatabaseOptions): DynamicModule {
        if (!options) {
            throw new Error('[DatabaseModule] options are required');
        }

        if (!options.type) {
            throw new Error('[DatabaseModule] type is required');
        }

        if (!options.host) {
            throw new Error('[DatabaseModule] host is required');
        }

        if (!options.port) {
            throw new Error('[DatabaseModule] port is required');
        }

        if (!options.username) {
            throw new Error('[DatabaseModule] username is required');
        }

        if (!options.password) {
            throw new Error('[DatabaseModule] password is required');
        }

        if (!options.database) {
            throw new Error('[DatabaseModule] database is required');
        }

        if (!options.type) {
            throw new Error('[DatabaseModule] type is required');
        }

        let ormOptions: TypeOrmModuleOptions;

        if (options.type === 'postgres') {
            ormOptions = {
                type: 'postgres',
                host: options.host,
                port: options.port,
                username: options.username,
                password: options.password,
                database: options.database,

                autoLoadEntities: true,
                synchronize: options.synchronize ?? false,
                logging: options.logging ?? false,

                // ✅ postgres 전용
                ssl: options.ssl ? { rejectUnauthorized: false } : undefined,
            };
        } else if (options.type === 'mssql') {
            ormOptions = {
                type: 'mssql',
                host: options.host,
                port: options.port,
                username: options.username,
                password: options.password,
                database: options.database,

                autoLoadEntities: true,
                synchronize: options.synchronize ?? false,
                logging: options.logging ?? false,

                // ✅ mssql 전용
                options: {
                    encrypt: true,
                    trustServerCertificate: true,
                },
            };
        } else {
            throw new Error(`[DatabaseModule] Unsupported database type`);
        }

        return {
            module: DatabaseModule,
            imports: [
                TypeOrmModule.forRoot({
                    ...ormOptions,
                }),
            ],
            exports: [TypeOrmModule],
        };
    }
}
