import ftp from 'basic-ftp';
import { FileUploader } from './uploader.interface.js';
import path from 'path';
import { FtpConfig } from 'src/core/core.schema.js';

export class FtpUploader implements FileUploader {
    constructor(private readonly config: FtpConfig) {}

    async upload(localPath: string, { remotePath }: { remotePath: string }) {
        const client = new ftp.Client();
        try {
            await client.access({
                host: this.config.host,
                port: this.config.port,
                user: this.config.user,
                password: this.config.password,
                secure: this.config.secure,
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
