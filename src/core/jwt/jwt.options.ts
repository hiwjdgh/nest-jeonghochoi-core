import { JwtSignOptions as RootJwtSignOptions } from '@nestjs/jwt';

export interface JwtModuleOptions {
    secret: string;
    signOptions?: RootJwtSignOptions;
}
