import fs from 'fs';
import path from 'path';
import { FileUploader } from './uploader.interface';

export class LocalUploader implements FileUploader {
    async upload(localPath: string, { destDir }: { destDir: string }) {
        const fileName = path.basename(localPath);
        const destPath = path.join(destDir, fileName);

        await fs.promises.mkdir(destDir, { recursive: true });
        await fs.promises.copyFile(localPath, destPath);

        return { location: destPath };
    }
}
