import type { CatalogItem, CatalogItemLayout } from "@engine-model/catalog";
import { applyStaticClassPatch } from "./applyStaticClassPatch";
import { buildLogicNodeShell } from "./buildLogicNodeShell";
import { mergeAttrs } from "./mergeAttrs";
import { getVisualModule } from "@engine-components/graph-renderer/services/builder/helpers";

export const applyCatalogVisualPatch = (
    item: CatalogItem,
    dimensions: Required<Pick<CatalogItemLayout, "minHeight" | "minWidth">>,
) => {
    const visualModule = getVisualModule(item);
    const shell = buildLogicNodeShell(dimensions);

    return {
        attrs: applyStaticClassPatch(
            mergeAttrs(shell.attrs, visualModule?.config.base?.attrs),
            visualModule?.config.base?.class,
        ),
        markup: visualModule?.config.base?.markup ?? shell.markup,
    };
};
