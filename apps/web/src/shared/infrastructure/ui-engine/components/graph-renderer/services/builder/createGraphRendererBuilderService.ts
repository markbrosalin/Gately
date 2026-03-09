import { STROKE_WIDTH, type UIEngineNodeProps } from "engine-model";
import { createCatalogItemRefKey } from "engine-model/catalog/lib";
import { useVisualPortLayoutRegistrator } from "../../../../services/node-visual/port-layout-registrator";
import { DEFAULT_NODE_POSITION } from "./constants";
import { createNodeVisual, createPorts, ensurePositiveDimension } from "./helpers";
import type { GraphRendererBuildNodeInput, GraphRendererBuilderService } from "./types";
import { CatalogItemLayout } from "engine-model/catalog";

export const createGraphRendererBuilderApi = (): GraphRendererBuilderService => {
    const ensurePositiveLayoutDimensions = (
        layout: CatalogItemLayout,
    ): Required<Omit<CatalogItemLayout, "extensions">> => {
        const width = ensurePositiveDimension(layout.width, "layout.width");
        const height = ensurePositiveDimension(layout.height, "layout.height");
        const minWidth = ensurePositiveDimension(layout.minWidth ?? width, "layout.minWidth");
        const minHeight = ensurePositiveDimension(layout.minHeight ?? height, "layout.minHeight");

        return { width, height, minHeight, minWidth };
    };

    const buildNodeProps = ({ item, position }: GraphRendererBuildNodeInput): UIEngineNodeProps => {
        const { width, height, minHeight, minWidth } = ensurePositiveLayoutDimensions(item.layout);
        const { attrs, markup } = createNodeVisual(item, { minWidth, minHeight });
        const nextPosition = position ?? DEFAULT_NODE_POSITION;

        return {
            x: nextPosition.x,
            y: nextPosition.y,
            width: width + STROKE_WIDTH,
            height: height + STROKE_WIDTH,
            markup,
            attrs,
            ports: createPorts(item),
            data: {
                ref: item.ref,
                refKey: createCatalogItemRefKey(item.ref),
                kind: item.kind,
            },
        };
    };

    return {
        buildNodeProps,
    };
};

export const createGraphRendererBuilderService = (): GraphRendererBuilderService => {
    useVisualPortLayoutRegistrator().registerPortLayouts();

    return createGraphRendererBuilderApi();
};
