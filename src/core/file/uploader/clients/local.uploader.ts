import fs from 'fs';
import path from 'path';
import { FileUploader } from './uploader.interface.js';
import { LocalUploaderOptions } from '../uploder.options.js';

export class LocalUploader implements FileUploader {
    constructor(private readonly config: LocalUploaderOptions = { type: 'local' }) {}

    async upload(localPath: string, { destDir }: { destDir?: string }) {
        const fileName = path.basename(localPath);
        const baseDir = destDir ?? this.config.basePath ?? '.';
        const destPath = path.join(baseDir, fileName);

        await fs.promises.mkdir(baseDir, { recursive: true });
        await fs.promises.copyFile(localPath, destPath);

        return { location: destPath };
    }
}
