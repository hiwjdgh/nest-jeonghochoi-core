import fs from 'fs/promises';
import path from 'path';
import { TemplateConfig } from '../../config';

export class MailTemplateLoader {
    constructor(private readonly config: TemplateConfig) {}

    async loadTemplate(name: string): Promise<string> {
        const filePath = path.join(this.config.templateDir, `${name}.hbs`);
        return fs.readFile(filePath, 'utf-8');
    }
}
