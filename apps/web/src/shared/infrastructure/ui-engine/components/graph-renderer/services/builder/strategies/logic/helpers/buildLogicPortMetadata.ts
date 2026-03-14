import { DEFAULT_VALUE_CLASS } from "@engine-model/constants";
import type { PinSide } from "@engine-model/graph-renderer";
import type { CatalogPortAnchor, CatalogPortSpec } from "@engine-model/catalog";
import type { LabelMetadata, PortMetadata } from "@antv/x6/lib/model/port";
import { buildPortClass } from "./buildPortClass";
import { PORT_LABEL_MARKUP } from "../../../constants";

const resolvePortAnchor = (port: CatalogPortSpec, side: PinSide): CatalogPortAnchor => {
    return port.anchor ?? (side === "input" ? "left" : "right");
};

const createPortArgs = (anchor: CatalogPortAnchor, offset?: number) => {
    if (offset === undefined) {
        return undefined;
    }

    switch (anchor) {
        case "left":
            return { dx: -offset };
        case "right":
            return { dx: offset };
        case "top":
            return { dy: -offset };
        case "bottom":
            return { dy: offset };
    }
};

const createPortLabel = (anchor: CatalogPortAnchor, title?: string): LabelMetadata | undefined => {
    if (!title) {
        return undefined;
    }

    return {
        markup: PORT_LABEL_MARKUP,
        position: { name: anchor },
    };
};

export const buildLogicPortMetadata = (port: CatalogPortSpec, side: PinSide): PortMetadata => {
    const anchor = resolvePortAnchor(port, side);
    const baseClass = buildPortClass(side, DEFAULT_VALUE_CLASS);
    const args = createPortArgs(anchor, port.offset);

    return {
        id: port.id,
        group: anchor,
        ...(port.title ? { label: createPortLabel(anchor, port.title) } : {}),
        ...(args ? { args } : {}),
        attrs: {
            circle: { class: baseClass },
            ...(port.title ? { text: { text: port.title } } : {}),
        },
    };
};
