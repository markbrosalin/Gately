import type { CatalogItem } from "engine-model/catalog";
import { createBaseNodeAttrs, createBaseNodeMarkup } from "engine-model";
import { mergeAttrs } from "../../../../../../services/node-visual/lib/attrs";
import { getVisualModule } from "../getCatalogModules";
import { applyStaticClassPatch } from "./applyStaticClassPatch";

export const createNodeVisual = (
    item: CatalogItem,
    dimensions: { minWidth: number; minHeight: number },
) => {
    const visualModule = getVisualModule(item);
    const attrs = applyStaticClassPatch(
        mergeAttrs(
            createBaseNodeAttrs({
                minWidth: dimensions.minWidth,
                minHeight: dimensions.minHeight,
            }),
            visualModule?.config.base?.attrs,
        ),
        visualModule?.config.base?.class,
    );
    const markup = visualModule?.config.base?.markup ?? createBaseNodeMarkup();

    return {
        attrs,
        markup,
    };
};
