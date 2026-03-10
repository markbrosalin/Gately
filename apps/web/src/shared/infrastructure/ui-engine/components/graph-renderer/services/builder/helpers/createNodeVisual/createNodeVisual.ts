import type { CatalogItem, CatalogItemLayout } from "@engine-model/catalog";
import { mergeAttrs } from "../../../../../../services/node-visual/lib/attrs";
import { getVisualModule } from "../getCatalogModules";
import { applyStaticClassPatch } from "./applyStaticClassPatch";
import {
    buildStdLogicItemAttrs,
    buildStdLogicItemMarkup,
} from "@engine-components/catalog/specs/std-library";

export const createNodeVisual = (
    item: CatalogItem,
    dimensions: Required<Pick<CatalogItemLayout, "minHeight" | "minWidth">>,
) => {
    const visualModule = getVisualModule(item);
    const attrs = applyStaticClassPatch(
        mergeAttrs(
            buildStdLogicItemAttrs({
                minWidth: dimensions.minWidth,
                minHeight: dimensions.minHeight,
            }),
            visualModule?.config.base?.attrs,
        ),
        visualModule?.config.base?.class,
    );
    const markup = visualModule?.config.base?.markup ?? buildStdLogicItemMarkup();

    return {
        attrs,
        markup,
    };
};
