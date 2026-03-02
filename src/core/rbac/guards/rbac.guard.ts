import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable,
    Optional,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
    IS_PUBLIC_KEY,
    PERMISSIONS_KEY,
    PERMISSION_CHECKER_TOKEN,
    RBAC_CONTEXT_PROVIDER_TOKEN,
} from '../constants';
import type { PermissionChecker, RbacContextProvider } from '../interfaces';
import { Request } from 'express';

@Injectable()
export class RbacGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,

        @Optional()
        @Inject(PERMISSION_CHECKER_TOKEN)
        private readonly permissionChecker?: PermissionChecker,

        @Optional()
        @Inject(RBAC_CONTEXT_PROVIDER_TOKEN)
        private readonly contextProvider?: RbacContextProvider,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        /* Public 체크 */
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) return true;

        /* RBAC provider가 하나라도 없으면 스킵 */
        const permissionChecker = this.permissionChecker;
        const contextProvider = this.contextProvider;
        if (!permissionChecker || !contextProvider) {
            return true;
        }

        const requiredPermissions =
            this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
                context.getHandler(),
                context.getClass(),
            ]) ?? [];

        if (requiredPermissions.length === 0) {
            return true;
        }

        /* request */
        const request = context.switchToHttp().getRequest<Request>();

        /* 앱 컨텍스트 */
        const appContext = contextProvider.getContext(request);

        /* 검사 */
        const results = await Promise.all(
            requiredPermissions.map((permission) =>
                permissionChecker.hasPermission(appContext, permission),
            ),
        );

        const allowed = results.every(Boolean);

        if (!allowed) {
            throw new ForbiddenException('Permission denied');
        }

        return true;
    }
}
