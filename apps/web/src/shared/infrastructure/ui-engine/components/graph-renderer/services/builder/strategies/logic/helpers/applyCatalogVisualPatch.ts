import type { MarkupJSONMarkup } from "@antv/x6/lib/view/markup";
import type { CatalogItem } from "@engine-model/catalog";
import { NODE_INSET, STROKE_WIDTH } from "@engine-model/constants";
import { applyStaticClassPatch } from "./applyStaticClassPatch";
import { mergeAttrs } from "./mergeAttrs";
import { getVisualModule } from "@engine-components/graph-renderer/services/builder/helpers";
import { buildStdLogicItemMarkup } from "@engine-presets/std-library/logic/visual-factories";

type BaseLogicVisualDimensions = {
    width: number;
    height: number;
};

const buildBaseLogicAttrs = ({ width, height }: BaseLogicVisualDimensions) => {
    return {
        body: {
            x: NODE_INSET,
            y: NODE_INSET,
            width: width - STROKE_WIDTH,
            height: height - STROKE_WIDTH,
            strokeWidth: STROKE_WIDTH,
            "stroke-linejoin": "round",
            "stroke-linecap": "round",

            rx: 4,
            ry: 4,

            fill: "var(--color-gray-1)",
            stroke: "var(--color-gray-11)",
        },
        icon: {
            stroke: "var(--color-gray-9)",
            "stroke-width": 2,
            "stroke-linejoin": "round",
            "stroke-linecap": "round",
            fill: "none",

            ref: "body",
            refX: "50%",
            refY: "50%",
        },
    };
};

const buildBaseLogicMarkup = (): MarkupJSONMarkup[] => buildStdLogicItemMarkup();

export const applyCatalogVisualPatch = (
    item: CatalogItem,
    dimensions: BaseLogicVisualDimensions,
) => {
    const visualModule = getVisualModule(item);
    const baseAttrs = buildBaseLogicAttrs(dimensions);
    const baseMarkup = buildBaseLogicMarkup();

    return {
        attrs: applyStaticClassPatch(
            mergeAttrs(baseAttrs, visualModule?.config.base?.attrs),
            visualModule?.config.base?.class,
        ),
        markup: visualModule?.config.base?.markup ?? baseMarkup,
    };
};
