export interface RedisOptions {
    enabled?: boolean;

    host: string;
    port: number;

    password?: string;
    db?: number;

    keyPrefix?: string;
    enableReadyCheck?: boolean;
}
