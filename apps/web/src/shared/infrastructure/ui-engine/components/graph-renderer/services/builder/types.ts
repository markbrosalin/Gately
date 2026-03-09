import type { CatalogItem } from "engine-model/catalog";
import type { UIEngineNodeProps } from "engine-model/types";
import type { XYCoords } from "@gately/shared/types";

export type GraphRendererNodePosition = XYCoords;

export type GraphRendererBuildNodeInput = {
    item: CatalogItem;
    position?: GraphRendererNodePosition;
};

export type GraphRendererBuilderService = {
    buildNodeProps: (input: GraphRendererBuildNodeInput) => UIEngineNodeProps;
};
