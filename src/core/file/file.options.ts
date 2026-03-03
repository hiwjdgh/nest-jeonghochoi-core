import { UploaderOptions } from './uploader/uploader.options.js';
import { WriterOptions } from './writer/writer.options.js';

export interface FileOptions {
    enabled?: boolean;
    uploader?: UploaderOptions;
    writer?: WriterOptions;
}
