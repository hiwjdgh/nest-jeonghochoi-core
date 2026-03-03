import { DynamicModule, Global, Module } from '@nestjs/common';
import { FileOptions } from './file.options.js';
import { UploaderRegistry } from './uploader/uploader.registry.js';
import { WriterRegistry } from './writer/writer.registry.js';
import { FtpUploader } from './uploader/clients/ftp.uploader.js';
import { S3Uploader } from './uploader/clients/s3.uploader.js';
import { LocalUploader } from './uploader/clients/local.uploader.js';
import { CsvWriter } from './writer/clients/csv.writer.js';
import { ExcelWriter } from './writer/clients/excel.writer.js';
import { FileService } from './file.service.js';

@Global()
@Module({})
export class FileModule {
    static forRoot(options: FileOptions = {}): DynamicModule {
        const uploaderRegistry = new UploaderRegistry();
        const writerRegistry = new WriterRegistry();

        Object.entries(options.uploader ?? {}).forEach(([name, config]) => {
            if (config.type === 'ftp') {
                uploaderRegistry.register(name, new FtpUploader(config));
                return;
            }

            if (config.type === 's3') {
                uploaderRegistry.register(name, new S3Uploader(config));
                return;
            }

            uploaderRegistry.register(name, new LocalUploader(config));
        });

        Object.entries(options.writer ?? {}).forEach(([name, config]) => {
            if (config.type === 'excel') {
                writerRegistry.register(name, new ExcelWriter());
                return;
            }

            writerRegistry.register(name, new CsvWriter());
        });

        return {
            module: FileModule,
            providers: [
                {
                    provide: UploaderRegistry,
                    useValue: uploaderRegistry,
                },
                {
                    provide: WriterRegistry,
                    useValue: writerRegistry,
                },
                FileService,
            ],
            exports: [FileService, UploaderRegistry, WriterRegistry],
        };
    }
}
