import { resolveDependencyOrder } from "./resolveDependencyOrder";
import type { UIEngineHooks } from "../../model";

export type OrderedDependencyDefinition<TName extends string, TRequirement extends string = never> = {
    name: TName;
    after?: readonly TName[];
    requiredDeps?: readonly TRequirement[];
};

type ApplyDependencyDefinitionsOptions<
    TName extends string,
    TRequirement extends string,
    TDefinition extends OrderedDependencyDefinition<TName, TRequirement>,
> = {
    definitions: readonly TDefinition[];
    label?: string;
    apply: (definition: TDefinition) => void | (() => void);
    assertDependency?: (name: TRequirement) => void;
    onLifecycle?: UIEngineHooks["onLifecycle"];
    onError?: UIEngineHooks["onError"];
};

export const applyDependencyDefinitions = <
    TName extends string,
    TRequirement extends string,
    TDefinition extends OrderedDependencyDefinition<TName, TRequirement>,
>(
    options: ApplyDependencyDefinitionsOptions<TName, TRequirement, TDefinition>,
): Array<() => void> => {
    const label = options.label ?? "plugin";
    const ordered = resolveDependencyOrder(
        options.definitions.map((definition) => ({
            name: definition.name,
            deps: definition.after,
            value: definition,
        })),
    ).map((entry) => entry.value);

    const disposers: Array<() => void> = [];

    ordered.forEach((definition) => {
        definition.requiredDeps?.forEach((name) => {
            try {
                options.assertDependency?.(name);
            } catch (error) {
                options.onError?.({
                    label,
                    stage: "runtime",
                    name: definition.name,
                    error,
                });
                throw error;
            }
        });

        let dispose: void | (() => void);
        try {
            dispose = options.apply(definition);
        } catch (error) {
            options.onError?.({
                label,
                stage: "create",
                name: definition.name,
                error,
            });
            throw error;
        }

        options.onLifecycle?.({
            type: "plugin:applied",
            label,
            name: definition.name,
        });
        if (typeof dispose === "function") {
            disposers.push(() => {
                try {
                    dispose();
                } catch (error) {
                    options.onError?.({
                        label,
                        stage: "dispose",
                        name: definition.name,
                        error,
                    });
                    throw error;
                }

                options.onLifecycle?.({
                    type: "plugin:disposed",
                    label,
                    name: definition.name,
                });
            });
        }
    });

    return disposers;
};

