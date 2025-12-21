import { DatabaseOptions } from './database/database.options';
import { LoggerOptions } from './logger';
import { RedisOptions } from './redis';

export interface CoreOptions {
    database?: DatabaseOptions;
    logger?: LoggerOptions;
    redis?: RedisOptions;
}
