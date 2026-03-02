export class Codec {
    static base64Encode(data: string): string {
        return Buffer.from(data, 'utf8').toString('base64');
    }

    static base64Decode(data: string): string {
        return Buffer.from(data, 'base64').toString('utf8');
    }

    static hexEncode(data: string): string {
        return Buffer.from(data, 'utf8').toString('hex');
    }

    static hexDecode(data: string): string {
        return Buffer.from(data, 'hex').toString('utf8');
    }
}
