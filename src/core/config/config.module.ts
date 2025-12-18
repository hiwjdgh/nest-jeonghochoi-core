import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validateEnv } from './validate-env';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            validate: validateEnv,
            envFilePath: ['.env'],
        }),
    ],
})
export class ConfigModule {}
