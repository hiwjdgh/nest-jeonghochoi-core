import fs from 'fs';
import { stringify } from 'csv-stringify';
import { FileWriter } from './writer.interface.js';

export class CsvWriter<T = any> implements FileWriter<T> {
    async write(
        rows: T[],
        { filePath, headers }: { filePath: string; headers?: string[] }
    ) {
        await new Promise<void>((resolve, reject) => {
            const output = fs.createWriteStream(filePath);
            const stringifier = stringify({
                header: !!headers,
                columns: headers,
            });

            stringifier.on('error', reject);
            output.on('finish', resolve);

            stringifier.pipe(output);
            rows.forEach((r) => stringifier.write(r));
            stringifier.end();
        });

        return { filePath };
    }
}
