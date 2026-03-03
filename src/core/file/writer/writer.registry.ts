import { Injectable } from '@nestjs/common';
import { FileWriter } from './clients/writer.interface.js';

type WriterOptions = {
    filePath?: string;
    headers?: string[];
};

class ConfiguredWriter implements FileWriter {
    constructor(
        private readonly writer: FileWriter,
        private readonly defaults: WriterOptions,
    ) {}

    write(rows: any[], options: WriterOptions = {}) {
        const finalOptions = {
            ...this.defaults,
            ...options,
        };

        if (!finalOptions.filePath) {
            throw new Error('writer option "filePath" is required');
        }

        return this.writer.write(rows, finalOptions as { filePath: string; headers?: string[] });
    }
}

@Injectable()
export class WriterRegistry {
    private readonly writers = new Map<string, FileWriter>();

    register(name: string, writer: FileWriter, defaults: WriterOptions = {}) {
        this.writers.set(name, new ConfiguredWriter(writer, defaults));
    }

    use(name: string): FileWriter {
        const writer = this.writers.get(name);
        if (!writer) {
            throw new Error(`Writer "${name}" not registered`);
        }

        return writer;
    }
}
