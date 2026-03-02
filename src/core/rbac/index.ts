export { RbacModule } from './rbac.module';
/* =========================
 * Guards
 * ========================= */
export { RbacGuard } from './guards/rbac.guard';

/* =========================
 * Decorators
 * ========================= */
export { Public, RequirePermissions } from './decorators';

/* =========================
 * Interfaces (type-only)
 * ========================= */
export type { RbacContextProvider, PermissionChecker } from './interfaces';
