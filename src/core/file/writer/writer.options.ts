export type CsvWriterOptions = {
    path: string;
};

export type ExcelWriterOptions = {
    path: string;
};

export type WriterDefinition = CsvWriterOptions | ExcelWriterOptions;

export type WriterOptions = Record<string, WriterDefinition>;
