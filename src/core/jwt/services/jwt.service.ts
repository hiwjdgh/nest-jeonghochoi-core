import { Injectable } from '@nestjs/common';
import { JwtService as RootJwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types';

@Injectable()
export class JwtService {
    constructor(private readonly jwt: RootJwtService) {}

    sign(payload: object): string {
        return this.jwt.sign(payload);
    }

    verify<T extends object = JwtPayload>(token: string): T {
        return this.jwt.verify(token);
    }

    decode<T extends object = JwtPayload>(token: string): T | null {
        return this.jwt.decode(token);
    }
}
