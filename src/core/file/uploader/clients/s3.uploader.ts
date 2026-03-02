import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { FileUploader } from './uploader.interface.js';
import { S3Config } from 'src/core/core.schema.js';

export class S3Uploader implements FileUploader {
    private client: S3Client;
    private bucket: string;

    constructor(config: S3Config) {
        this.bucket = config.bucket;
        this.client = new S3Client({
            region: config.region,
            credentials:
                config.accessKeyId && config.secretAccessKey
                    ? {
                          accessKeyId: config.accessKeyId,
                          secretAccessKey: config.secretAccessKey,
                      }
                    : undefined,
        });
    }

    async upload(localPath: string, { key }: { key: string }) {
        const body = fs.createReadStream(localPath);

        await this.client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: body,
            }),
        );

        return { location: `s3://${this.bucket}/${key}` };
    }
}
