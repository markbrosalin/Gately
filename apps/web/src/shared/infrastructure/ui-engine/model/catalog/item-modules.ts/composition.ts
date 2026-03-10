import { XYCoords } from "@gately/shared/types";
import { CatalogModuleBase } from ".";
import { CatalogExtensions } from "../item";
import { CatalogItemRef } from "../ref";

export type CatalogCompositionPinRef = {
    itemId: string;
    portId: string;
};

export type CatalogCompositionConnection = {
    from: CatalogCompositionPinRef;
    to: CatalogCompositionPinRef;
};

export type CatalogCompositionInnerItem = {
    id: string;
    ref: CatalogItemRef;
    extensions?: CatalogExtensions;
};

type CatalogCompositionBoundaryPortBase = {
    outerPortId: string;
    position: XYCoords;
    extensions?: CatalogExtensions;
};

export type CatalogCompositionBoundary = {
    inputs: CatalogCompositionBoundaryPortBase[];
    outputs: CatalogCompositionBoundaryPortBase[];
};

export type CatalogCompositionInputBinding = {
    outerPortId: string;
    targets: CatalogCompositionPinRef[];
};

export type CatalogCompositionOutputBinding = {
    outerPortId: string;
    source: CatalogCompositionPinRef;
};

export type CatalogCompositionModule = CatalogModuleBase<
    "composition",
    {
        contentJson: string;
        items: CatalogCompositionInnerItem[];
        connections: CatalogCompositionConnection[];
        boundary: CatalogCompositionBoundary;
        inputBindings: CatalogCompositionInputBinding[];
        outputBindings: CatalogCompositionOutputBinding[];
    }
>;

