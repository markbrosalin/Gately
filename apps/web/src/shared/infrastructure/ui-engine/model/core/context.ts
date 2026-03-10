import type { SharedServiceGetter, SharedServiceName, SharedServices } from "../../shared-services";
import type { UIEngineExternalContext } from "./engine";

export type ServiceGetter<TName extends string, TServices extends Record<TName, unknown>> = <
    K extends TName,
>(
    name: K,
) => TServices[K];

export type ServiceDefinition<TName extends string, TService> = {
    create: () => TService;
    createDeps?: readonly TName[];
    runtimeDeps?: readonly TName[];
};

export type ServiceDefinitionMap<TName extends string, TServices extends Record<TName, unknown>> = {
    [K in TName]: ServiceDefinition<TName, TServices[K]>;
};

export type ServiceContext<
    TExternal extends object,
    TServiceName extends string,
    TServices extends Record<TServiceName, unknown>,
    TSharedName extends string,
    TSharedServices extends Record<TSharedName, unknown>,
> = {
    external: TExternal;
    getService: ServiceGetter<TServiceName, TServices>;
    getSharedService: ServiceGetter<TSharedName, TSharedServices>;
};

export type ComponentExternal<TExternal extends object = {}> = UIEngineExternalContext & TExternal;

export type ComponentDeps<TExternal extends object = {}> = {
    external: ComponentExternal<TExternal>;
    getSharedService: SharedServiceGetter;
};

export type ComponentServiceContext<
    TExternal extends object,
    TServiceName extends string,
    TServices extends Record<TServiceName, unknown>,
> = ServiceContext<
    ComponentExternal<TExternal>,
    TServiceName,
    TServices,
    SharedServiceName,
    SharedServices
>;

