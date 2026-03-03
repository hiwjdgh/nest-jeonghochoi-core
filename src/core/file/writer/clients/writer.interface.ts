import { FileWriteResult } from '../../file.types';

export interface FileWriter<T = any> {
    write(
        rows: T[],
        options: {
            filePath: string;
            headers?: string[];
        },
    ): Promise<FileWriteResult>;
}
