import { Injectable } from '@nestjs/common';
import { FileWriter } from './clients/writer.interface.js';

@Injectable()
export class WriterRegistry {
    private readonly writers = new Map<string, FileWriter>();

    register(name: string, writer: FileWriter) {
        this.writers.set(name, writer);
    }

    use(name: string): FileWriter {
        const writer = this.writers.get(name);
        if (!writer) {
            throw new Error(`Writer "${name}" not registered`);
        }

        return writer;
    }
}
