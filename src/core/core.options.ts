import { DatabaseOptions } from './database/database.options';
import { JwtModuleOptions } from './jwt/jwt.options';
import { LoggerOptions } from './logger';
import { RedisOptions } from './redis';
import { RbacModuleOptions } from './rbac/rbac.module';

export interface CoreOptions {
    database?: DatabaseOptions;
    jwt?: JwtModuleOptions & { enabled?: boolean };
    logger?: LoggerOptions;
    rbac?: RbacModuleOptions & { enabled?: boolean };
    redis?: RedisOptions;
}
