import { Injectable } from '@nestjs/common';
import { UploaderRegistry } from './uploader/uploader.registry.js';
import { WriterRegistry } from './writer/writer.registry.js';

@Injectable()
export class FileService {
    constructor(
        private readonly uploaders: UploaderRegistry,
        private readonly writers: WriterRegistry,
    ) {}

    upload<TOptions = any>(
        uploaderName: string,
        localPath: string,
        options: TOptions,
    ) {
        return this.uploaders.use(uploaderName).upload(localPath, options);
    }

    write<TRow = any, TOptions = any>(
        writerName: string,
        rows: TRow[],
        options: TOptions,
    ) {
        return this.writers.use(writerName).write(rows, options as any);
    }
}
