import type { CatalogItemLayout } from "@engine-model/catalog";
import { createBaseNodeAttrs, createBaseNodeMarkup } from "@engine-model/nodes-spec";

export const buildLogicNodeShell = (
    dimensions: Required<Pick<CatalogItemLayout, "minHeight" | "minWidth">>,
) => {
    return {
        attrs: createBaseNodeAttrs({
            minWidth: dimensions.minWidth,
            minHeight: dimensions.minHeight,
        }),
        markup: createBaseNodeMarkup(),
    };
};

