import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { RbacGuard } from './guards/rbac.guard';
import {
    PERMISSION_CHECKER_TOKEN,
    RBAC_CONTEXT_PROVIDER_TOKEN,
} from './constants';
import { PermissionChecker, RbacContextProvider } from './interfaces';

export interface RbacModuleOptions {
    contextProvider?: Type<RbacContextProvider>;
    permissionChecker?: Type<PermissionChecker>;
}

@Module({})
export class RbacModule {
    static forRoot(options: RbacModuleOptions = {}): DynamicModule {
        const providers: Provider[] = [RbacGuard];

        if (options.contextProvider) {
            providers.push({
                provide: RBAC_CONTEXT_PROVIDER_TOKEN,
                useClass: options.contextProvider,
            });
        }

        if (options.permissionChecker) {
            providers.push({
                provide: PERMISSION_CHECKER_TOKEN,
                useClass: options.permissionChecker,
            });
        }

        return {
            module: RbacModule,
            providers,
            exports: [RbacGuard],
        };
    }
}
