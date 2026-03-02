import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_OPTIONS } from '../constants';
import type { JwtModuleOptions } from '../jwt.options';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-core') {
    constructor(
        @Inject(JWT_OPTIONS)
        options: JwtModuleOptions,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: options.secret,
        });
    }

    validate(payload: unknown) {
        return payload;
    }
}
