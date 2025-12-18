import { DatabaseOptions } from './database';
import { LoggerOptions } from './logger';
import { RedisOptions } from './redis';

export interface CoreOptions {
    database?: DatabaseOptions;
    logger?: LoggerOptions;
    redis?: RedisOptions;
}
