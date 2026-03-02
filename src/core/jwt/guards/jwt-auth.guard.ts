import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-core') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const can = (await super.canActivate(context)) as boolean;

        if (!can) {
            throw new UnauthorizedException('JWT authentication required');
        }

        return true;
    }
}
