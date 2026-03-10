export const createUninitializedGetter = <TGetter>(componentName: string): TGetter => {
    return (() => {
        throw new Error(`[UIEngine] ${componentName} service getter is not initialized`);
    }) as TGetter;
};

