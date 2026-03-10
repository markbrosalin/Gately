export type WorkspaceExternal = {
    logicEngine?: {
        call: (path: string, input: unknown) => Promise<unknown>;
    };
};

