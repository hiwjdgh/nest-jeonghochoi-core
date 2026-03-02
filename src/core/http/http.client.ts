import axios, { AxiosInstance, AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import { Injectable } from '@nestjs/common';
import { HttpError } from './http.error.js';
import { HttpEndpoint } from './http.endpoint.js';
import { HttpClientOptions } from './http.types.js';

@Injectable()
export class HttpClient {
    private readonly clients = new Map<string, HttpEndpoint>();

    /** 앱에서 client 등록 */
    register(name: string, options: HttpClientOptions) {
        if (this.clients.has(name)) {
            return;
        }

        const axiosClient = this.createAxiosClient(options);
        this.clients.set(name, new HttpEndpoint(axiosClient));
    }

    /** client 조회 */
    use(name: string): HttpEndpoint {
        const client = this.clients.get(name);
        if (!client) {
            throw new Error(`HttpClient "${name}" is not registered`);
        }
        return client;
    }

    /** axios instance 생성 */
    private createAxiosClient(options: HttpClientOptions): AxiosInstance {
        const client = axios.create({
            baseURL: options.baseURL,
            timeout: options.timeoutMs ?? 5000,
            headers: options.headers,
        });

        axiosRetry(client, {
            retries: options.retries ?? 3,
            retryCondition: (error) =>
                axiosRetry.isNetworkError(error) ||
                axiosRetry.isRetryableError(error),
        });

        client.interceptors.response.use(
            (res) => res,
            (err: AxiosError) => {
                const status = err.response?.status;
                const data = err.response?.data;

                throw new HttpError(
                    `HTTP request failed: ${err.message}`,
                    status,
                    data,
                );
            },
        );

        return client;
    }
}
