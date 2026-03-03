import fs from 'fs/promises';
import path from 'path';

export class MailTemplateLoader {
    constructor(private readonly templateDir: string) {}

    async loadTemplate(name: string): Promise<string> {
        const filePath = path.join(this.templateDir, `${name}.hbs`);
        return fs.readFile(filePath, 'utf-8');
    }
}
