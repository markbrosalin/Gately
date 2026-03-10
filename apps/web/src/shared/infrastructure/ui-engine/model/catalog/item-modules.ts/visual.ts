import type { CellAttrs, ComplexAttrs } from "@antv/x6/lib/registry/attr";
import type { MarkupJSONMarkup } from "@antv/x6/lib/view/markup";
import type { CatalogExtensions } from "../item";

export type CatalogVisualPatch = {
    attrs?: CellAttrs;
    markup?: MarkupJSONMarkup[];
    class?: Record<
        string,
        {
            add?: string[];
            remove?: string[];
        }
    >;
};

export type CatalogVisualIndexedStatePatch = {
    attrs?: ComplexAttrs;
    class?: {
        add?: string[];
        remove?: string[];
    };
};

export type CatalogVisualIndexedStateMap<TState extends string = string> = {
    targets: string[];
    states: Record<TState, CatalogVisualIndexedStatePatch>;
};

export type CatalogVisualConfig<TState extends string = string> = {
    base?: CatalogVisualPatch;
    states?: Record<TState, Omit<CatalogVisualPatch, "markup">>;
    indexedStates?: CatalogVisualIndexedStateMap<TState>;
    extensions?: CatalogExtensions;
};

export type CatalogVisualModule<TState extends string = string> = {
    type: "visual";
    config: CatalogVisualConfig<TState>;
    extensions?: CatalogExtensions;
};

