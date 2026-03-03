import { UploderOptions } from './uploader/uploder.options';
import { WriterOptions } from './writer/writer.options';

export interface FileOptions {
    enabled?: boolean;
    uploader: UploderOptions;
    writer: WriterOptions;
}
