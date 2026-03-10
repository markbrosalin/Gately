import type { ComponentDeps, UIEngineContext, UIEngineErrorEvent } from "../../model";
import type { SharedServiceGetter, SharedServiceName } from "../../shared-services";

export const createComponentRegistry = (ctx: UIEngineContext) => {
    const reportError = (event: UIEngineErrorEvent): void => {
        ctx.external.hooks?.onError?.(event);
    };

    const createScopedSharedServiceGetter = (componentName: string): SharedServiceGetter => {
        return ((name: SharedServiceName) => {
            if (name === "eventBus") {
                return ctx.getSharedService("eventBus").scope(componentName);
            }

            return ctx.getSharedService(name);
        }) as SharedServiceGetter;
    };

    const register = <TExternal extends object, T>(
        name: string,
        factory: (deps: ComponentDeps<TExternal>) => T,
    ): T => {
        try {
            const component = factory({
                external: ctx.external as ComponentDeps<TExternal>["external"],
                getSharedService: createScopedSharedServiceGetter(name),
            });
            ctx.external.hooks?.onLifecycle?.({
                type: "component:created",
                name,
            });

            return component;
        } catch (error) {
            reportError({
                label: "component",
                name,
                stage: "create",
                error,
            });
            throw error;
        }
    };

    return {
        register,
    };
};

