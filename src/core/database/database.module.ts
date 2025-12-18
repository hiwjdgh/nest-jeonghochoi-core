import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '../config/config.service';
import { DatabaseOptions } from './database.options';

@Module({})
export class DatabaseModule {
    static forRoot(options: DatabaseOptions = {}): DynamicModule {
        return {
            module: DatabaseModule,
            imports: [
                TypeOrmModule.forRootAsync({
                    inject: [ConfigService],
                    useFactory: (config: ConfigService) => {
                        const db = config.db;

                        const baseOptions = {
                            host: db.host,
                            port: db.port,
                            username: db.user,
                            password: db.password,
                            database: db.name,

                            autoLoadEntities: true,
                            synchronize: options.synchronize ?? false,
                            logging: options.logging ?? false,
                        };

                        if (db.type === 'postgres') {
                            return {
                                type: 'postgres',
                                ...baseOptions,
                                ssl: options.ssl
                                    ? { rejectUnauthorized: false }
                                    : false,
                            };
                        }

                        if (db.type === 'mssql') {
                            return {
                                type: 'mssql',
                                ...baseOptions,
                                options: {
                                    encrypt: true,
                                    trustServerCertificate: true,
                                },
                            };
                        }

                        throw new Error(`Unsupported DB_TYPE`);
                    },
                }),
            ],
            exports: [TypeOrmModule],
        };
    }
}
