import { UploaderOptions } from './uploader/uploder.options';

export interface FileOptions {
    enabled?: boolean;
    uploader: UploaderOptions;
    writer: DatabaseRegistry;
}
