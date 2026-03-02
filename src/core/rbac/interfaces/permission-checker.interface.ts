export interface PermissionChecker {
    hasPermission(context: any, permission: string): Promise<boolean>;
}
