import { UploadResult } from '../../file.types.js';

export interface FileUploader {
    upload(localPath: string, options: any): Promise<UploadResult>;
}
