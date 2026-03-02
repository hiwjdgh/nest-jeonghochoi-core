import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { PERMISSIONS_KEY } from '../constants';
import { RbacGuard } from '../guards/rbac.guard';

export function RequirePermissions(
    ...permissions: string[]
): MethodDecorator & ClassDecorator {
    return applyDecorators(
        SetMetadata(PERMISSIONS_KEY, permissions),
        UseGuards(RbacGuard),
    );
}
