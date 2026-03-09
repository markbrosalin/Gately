import type { CatalogPortAnchor, CatalogPortSpec } from "engine-model/catalog";
import { DEFAULT_VALUE_CLASS } from "engine-model";
import type { PortMetadata } from "@antv/x6/lib/model/port";
import { buildPortClass } from "../../../../../../lib/ports/buildPortClass";
import { PORT_LABEL_MARKUP } from "../../constants";

const resolvePortAnchor = (port: CatalogPortSpec): CatalogPortAnchor => {
    return port.anchor ?? (port.direction === "input" ? "left" : "right");
};

const createPortArgs = (anchor: CatalogPortAnchor, offset?: number) => {
    if (offset === undefined) {
        return undefined;
    }

    switch (anchor) {
        case "left":
        case "right":
            return { dy: offset };
        case "top":
        case "bottom":
            return { dx: offset };
        default:
            return undefined;
    }
};

const createPortLabel = (anchor: CatalogPortAnchor, title?: string) => {
    if (!title) {
        return undefined;
    }

    return {
        markup: PORT_LABEL_MARKUP,
        position: { name: anchor },
    };
};

export const createPortMetadata = (port: CatalogPortSpec): PortMetadata => {
    const anchor = resolvePortAnchor(port);
    const baseClass = buildPortClass(port.direction, DEFAULT_VALUE_CLASS);

    return {
        id: port.id,
        group: anchor,
        ...(port.title ? { label: createPortLabel(anchor, port.title) } : {}),
        ...(createPortArgs(anchor, port.offset)
            ? { args: createPortArgs(anchor, port.offset) }
            : {}),
        attrs: {
            circle: { class: baseClass },
            ...(port.title ? { text: { text: port.title } } : {}),
        },
    };
};
