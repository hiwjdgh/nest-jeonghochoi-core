import { CoreConfigService } from '../../../core/config/config.service.js';
import { S3Uploader } from './clients/s3.uploader.js';
import { FtpUploader } from './clients/ftp.uploader.js';

export class UploaderFactory {
    constructor(private readonly config: CoreConfigService<any>) {}

    createS3() {
        return new S3Uploader(this.config.get().s3);
    }

    createFtp() {
        return new FtpUploader(this.config.get().ftp);
    }
}
