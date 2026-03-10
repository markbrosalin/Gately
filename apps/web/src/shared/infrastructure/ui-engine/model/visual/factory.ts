import type { VisualBinding, VisualPatch, VisualPreset, VisualStateResolver } from "./types";

type CreateVisualBindingOptions<TState extends string> = Omit<VisualPreset<TState>, "states"> &
    Partial<Pick<VisualPreset<TState>, "states">> & {
        resolveState?: VisualStateResolver<TState>;
    };

export const createVisualBinding = <TState extends string>(
    options: CreateVisualBindingOptions<TState>,
): VisualBinding<TState> => {
    return {
        preset: {
            hash: options.hash,
            nodeName: options.nodeName,
            minWidth: options.minWidth,
            minHeight: options.minHeight,
            base: options.base,
            states: options.states ?? ({ default: {} } as Record<TState, VisualPatch>),
            indexedStates: options.indexedStates,
        },
        resolveState:
            options.resolveState ?? ((() => "default") as unknown as VisualStateResolver<TState>),
    };
};

