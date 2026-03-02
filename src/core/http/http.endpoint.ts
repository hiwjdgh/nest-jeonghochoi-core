import { AxiosInstance, AxiosRequestConfig } from 'axios';

export class HttpEndpoint {
    constructor(private readonly client: AxiosInstance) {}

    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.client.get<T>(url, config).then((r) => r.data);
    }

    post<T = any>(
        url: string,
        body?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        return this.client.post<T>(url, body, config).then((r) => r.data);
    }

    put<T = any>(
        url: string,
        body?: any,
        config?: AxiosRequestConfig
    ): Promise<T> {
        return this.client.put<T>(url, body, config).then((r) => r.data);
    }

    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.client.delete<T>(url, config).then((r) => r.data);
    }
}
