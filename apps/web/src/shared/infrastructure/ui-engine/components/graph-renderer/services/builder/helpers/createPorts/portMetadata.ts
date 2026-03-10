import type { CatalogPortAnchor, CatalogPortSpec } from "@engine-model/catalog";
import { DEFAULT_VALUE_CLASS } from "@engine-model";
import type { LabelMetadata, PortMetadata } from "@antv/x6/lib/model/port";
import { buildPortClass } from "../../../../../../lib/ports/buildPortClass";
import { PORT_LABEL_MARKUP } from "../../constants";

type PortDirection = "input" | "output";

const resolvePortAnchor = (port: CatalogPortSpec, direction: PortDirection): CatalogPortAnchor => {
    return port.anchor ?? (direction === "input" ? "left" : "right");
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
        default:
            return undefined;
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

export const createPortMetadata = (
    port: CatalogPortSpec,
    direction: PortDirection,
): PortMetadata => {
    const anchor = resolvePortAnchor(port, direction);
    const baseClass = buildPortClass(direction, DEFAULT_VALUE_CLASS);

    return {
        id: port.id,
        group: anchor,
        //label
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
