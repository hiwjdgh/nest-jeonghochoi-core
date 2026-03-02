import Excel from 'exceljs';
import { FileWriter } from './writer.interface.js';

export class ExcelWriter<T = any> implements FileWriter<T> {
    async write(
        rows: T[],
        { filePath, headers }: { filePath: string; headers?: string[] }
    ) {
        const workbook = new Excel.stream.xlsx.WorkbookWriter({
            filename: filePath,
        });
        const sheet = workbook.addWorksheet('Sheet1');

        if (headers) {
            sheet.addRow(headers).commit();
        }

        rows.forEach((r) => {
            sheet.addRow(r).commit();
        });

        await workbook.commit();
        return { filePath };
    }
}
