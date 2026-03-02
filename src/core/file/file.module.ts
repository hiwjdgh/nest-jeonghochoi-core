import { Module } from '@nestjs/common';

@Module({
    providers: [HttpClient],
    exports: [HttpClient],
})
export class FileModule {}
