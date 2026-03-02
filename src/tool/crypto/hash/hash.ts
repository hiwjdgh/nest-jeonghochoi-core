import crypto from 'crypto';

export class Hash {
    static sha256(data: string, output: 'hex' | 'base64' = 'hex'): string {
        return crypto.createHash('sha256').update(data).digest(output);
    }

    static hmacSha256(
        data: string,
        secret: string,
        output: 'hex' | 'base64' = 'hex'
    ): string {
        return crypto.createHmac('sha256', secret).update(data).digest(output);
    }
}
