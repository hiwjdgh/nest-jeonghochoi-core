import crypto from 'crypto';
import { Encoding } from '../crypto.types';

const ALGORITHM = 'aes-256-cbc';

export class Aes {
    static encrypt(
        plainText: string,
        key: Buffer,
        iv: Buffer,
        output: Encoding = 'base64',
    ): string {
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        const encrypted = Buffer.concat([
            cipher.update(plainText, 'utf8'),
            cipher.final(),
        ]);
        return encrypted.toString(output);
    }

    static decrypt(
        cipherText: string,
        key: Buffer,
        iv: Buffer,
        input: Encoding = 'base64',
    ): string {
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(cipherText, input)),
            decipher.final(),
        ]);
        return decrypted.toString('utf8');
    }

    static randomKey(): Buffer {
        return crypto.randomBytes(32); // 256bit
    }

    static randomIv(): Buffer {
        return crypto.randomBytes(16); // 128bit
    }
}
