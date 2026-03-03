import { Injectable } from '@nestjs/common';
import { FileUploader } from './clients/uploader.interface.js';

@Injectable()
export class UploaderRegistry {
    private readonly uploaders = new Map<string, FileUploader>();

    register(name: string, uploader: FileUploader) {
        this.uploaders.set(name, uploader);
    }

    use(name: string): FileUploader {
        const uploader = this.uploaders.get(name);
        if (!uploader) {
            throw new Error(`Uploader "${name}" not registered`);
        }

        return uploader;
    }
}
