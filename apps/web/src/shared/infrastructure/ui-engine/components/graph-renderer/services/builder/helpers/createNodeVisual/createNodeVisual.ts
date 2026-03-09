import type { CatalogItem } from "engine-model/catalog";
import { mergeAttrs } from "../../../../../../services/node-visual/lib/attrs";
import { getVisualModule } from "../getCatalogModules";
import { applyStaticClassPatch } from "./applyStaticClassPatch";
import {
    buildStdLogicItemAttrs,
    buildStdLogicItemMarkup,
} from "@gately/shared/infrastructure/ui-engine/components/catalog/specs/std-library";

export const createNodeVisual = (
    item: CatalogItem,
    dimensions: { minWidth: number; minHeight: number },
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
