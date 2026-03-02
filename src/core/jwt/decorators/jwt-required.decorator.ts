import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards';

export function JwtRequired(): MethodDecorator & ClassDecorator {
    return applyDecorators(UseGuards(JwtAuthGuard));
}
