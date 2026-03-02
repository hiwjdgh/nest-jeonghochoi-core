export interface RbacContextProvider {
    getContext(request: unknown): unknown;
}
