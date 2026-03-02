import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule as RootJwtModule } from '@nestjs/jwt';

import { JwtService } from './services';
import { JwtStrategy } from './strategies';
import { JwtModuleOptions } from './jwt.options';
import { JWT_OPTIONS } from './constants';

@Module({})
export class JwtModule {
    static forRoot(options: JwtModuleOptions): DynamicModule {
        return {
            module: JwtModule,
            imports: [
                RootJwtModule.register({
                    secret: options.secret,
                    signOptions: options.signOptions,
                }),
            ],
            providers: [
                {
                    provide: JWT_OPTIONS,
                    useValue: options,
                },
                JwtService,
                JwtStrategy,
            ],
            exports: [JwtService],
        };
    }
}
