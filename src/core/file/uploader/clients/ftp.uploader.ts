import ftp from 'basic-ftp';
import { FileUploader } from './uploader.interface.js';
import path from 'path';
import { FtpUploaderOptions } from '../uploder.options.js';

export class FtpUploader implements FileUploader {
    constructor(private readonly config: FtpUploaderOptions) {}

    async upload(localPath: string, { remotePath }: { remotePath: string }) {
        const client = new ftp.Client();
        try {
            await client.access({
                host: this.config.host,
                port: this.config.port ?? 21,
                user: this.config.user,
                password: this.config.password,
                secure: this.config.secure ?? false,
            });

            const finalPath = this.config.basePath
                ? path.join(this.config.basePath, remotePath)
                : remotePath;

            await client.uploadFrom(localPath, finalPath);

            return {
                location: `ftp://${this.config.host}/${finalPath}`,
            };
        } finally {
            client.close();
        }
    }
}
