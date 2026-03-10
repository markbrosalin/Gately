import { resolveDependencyOrder } from "./resolveDependencyOrder";
import type {
    ServiceDefinitionMap,
    ServiceGetter,
    UIEngineContext,
    UIEngineHooks,
} from "../../model";

type ServiceRegistryContext = {
    getService: UIEngineContext["getService"];
} & Pick<UIEngineContext, "external">;

const createRegistryGetter = <TName extends string, TServices extends Record<TName, unknown>>(
    registry: Partial<TServices>,
    label: string,
): ServiceGetter<TName, TServices> => {
    return <K extends TName>(name: K): TServices[K] => {
        const service = registry[name];
        if (!service) {
            throw new Error(`[UIEngine] ${label} "${String(name)}" is not initialized`);
        }

        return service;
    };
};

export const buildServiceRegistry = <
    TName extends string,
    TServices extends Record<TName, unknown>,
>(
    definitions: ServiceDefinitionMap<TName, TServices>,
    options?: {
        label?: string;
        onGetterCreated?: (getter: ServiceGetter<TName, TServices>) => void;
        onLifecycle?: UIEngineHooks["onLifecycle"];
        onError?: UIEngineHooks["onError"];
    },
): {
    services: TServices;
    getService: ServiceGetter<TName, TServices>;
} => {
    const registry: Partial<TServices> = {};
    const label = options?.label ?? "service";
    const getService = createRegistryGetter<TName, TServices>(registry, label);

    options?.onGetterCreated?.(getService);

    const orderedDefinitions = resolveDependencyOrder(
        (Object.keys(definitions) as TName[]).map((name) => ({
            name,
            deps: definitions[name].createDeps,
            value: definitions[name],
        })),
    );

    orderedDefinitions.forEach(({ name, value }) => {
        try {
            registry[name] = value.create() as TServices[typeof name];
        } catch (error) {
            options?.onError?.({
                label,
                stage: "create",
                name,
                error,
            });
            throw error;
        }

        options?.onLifecycle?.({
            type: "service:created",
            label,
            name,
        });
    });

    orderedDefinitions.forEach(({ value }) => {
        value.runtimeDeps?.forEach((name) => {
            try {
                getService(name);
            } catch (error) {
                options?.onError?.({
                    label,
                    stage: "runtime",
                    name,
                    error,
                });
                throw error;
            }
        });
    });

    return {
        services: registry as TServices,
        getService,
    };
};

export const buildContextServiceRegistry = <
    TName extends string,
    TServices extends Record<TName, unknown>,
>(
    definitions: ServiceDefinitionMap<TName, TServices>,
    options: {
        label: string;
        ctx: ServiceRegistryContext;
    },
): {
    services: TServices;
    getService: ServiceGetter<TName, TServices>;
} => {
    return buildServiceRegistry(definitions, {
        label: options.label,
        onGetterCreated: (getService) => {
            options.ctx.getService = getService;
        },
        onLifecycle: options.ctx.external.hooks?.onLifecycle,
        onError: options.ctx.external.hooks?.onError,
    });
};

