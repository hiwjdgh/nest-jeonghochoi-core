import { Module } from '@nestjs/common';
import { HttpClient } from './http.client.js';

@Module({
    providers: [HttpClient],
    exports: [HttpClient],
})
export class HttpModule {}
