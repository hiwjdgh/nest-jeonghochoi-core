export interface HttpClientOptions {
    baseURL?: string;
    timeoutMs?: number;
    retries?: number;
    headers?: Record<string, string>;
}
