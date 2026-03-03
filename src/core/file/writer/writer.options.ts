export interface CsvWriterOptions {
    type: 'csv';
    path?: string;
}

export interface ExcelWriterOptions {
    type: 'excel';
    path?: string;
}

export type WriterDefinition = CsvWriterOptions | ExcelWriterOptions;

export type WriterOptions = Record<string, WriterDefinition>;
