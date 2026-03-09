import type {
    CatalogItem,
    CatalogPortAnchor,
    CatalogPortSpec,
    CatalogVisualPatch,
} from "engine-model/catalog";
import {
    DEFAULT_VALUE_CLASS,
    STROKE_WIDTH,
    baseNodePorts,
    createBaseNodeAttrs,
    createBaseNodeMarkup,
    type UIEngineNodeProps,
} from "engine-model";
import type { CellAttrs } from "@antv/x6/lib/registry/attr";
import type { PortMetadata } from "@antv/x6/lib/model/port";
import { buildPortClass } from "../../../../lib/ports/buildPortClass";
import { createCatalogItemRefKey } from "engine-model/catalog/lib";
import { useVisualPortLayoutRegistrator } from "../../../../services/node-visual/port-layout-registrator";
import { mergeAttrs } from "../../../../services/node-visual/lib/attrs";
import type { GraphRendererBuildNodeInput, GraphRendererBuilderService } from "./types";
import { GraphRendererBuilderError } from "./error";

const DEFAULT_NODE_POSITION = { x: 122, y: 122 } as const;
const PORT_LABEL_MARKUP = [{ tagName: "text", selector: "text" }] as const;

const mergeClassTokens = (
    current: string | undefined,
    add?: string[],
    remove?: string[],
): string | undefined => {
    const tokens = new Set((current ?? "").split(/\s+/).filter(Boolean));

    for (const token of remove ?? []) {
        tokens.delete(token);
    }

    for (const token of add ?? []) {
        if (token) {
            tokens.add(token);
        }
    }

    const next = Array.from(tokens).join(" ").trim();
    return next || undefined;
};

const applyStaticClassPatch = (
    attrs: CellAttrs | undefined,
    classPatch?: CatalogVisualPatch["class"],
): CellAttrs | undefined => {
    if (!classPatch) {
        return attrs;
    }

    const next: CellAttrs = { ...(attrs ?? {}) };
    for (const [selector, rule] of Object.entries(classPatch)) {
        const currentSelectorAttrs = { ...(next[selector] ?? {}) };
        const nextClass = mergeClassTokens(
            typeof currentSelectorAttrs.class === "string" ? currentSelectorAttrs.class : undefined,
            rule?.add,
            rule?.remove,
        );

        if (nextClass !== undefined) {
            currentSelectorAttrs.class = nextClass;
        } else {
            delete currentSelectorAttrs.class;
        }

        next[selector] = currentSelectorAttrs;
    }

    return next;
};

const getVisualModule = (item: CatalogItem) =>
    item.modules.find((module) => module.type === "visual");

const getPortsModule = (item: CatalogItem) =>
    item.modules.find((module) => module.type === "ports");

const ensurePositiveDimension = (value: number, label: string): number => {
    if (!Number.isFinite(value) || value <= 0) {
        throw new GraphRendererBuilderError(`Catalog item ${label} must be a positive number.`);
    }

    return value;
};

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

const createPortMetadata = (port: CatalogPortSpec): PortMetadata => {
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

const createPorts = (item: CatalogItem) => {
    const portsModule = getPortsModule(item);
    const ports = portsModule?.config.items ?? [];
    const orderedPorts = ports
        .map((port, index) => ({ port, index }))
        .sort((left, right) => {
            const leftOrder = left.port.order ?? left.index;
            const rightOrder = right.port.order ?? right.index;
            return leftOrder - rightOrder;
        })
        .map(({ port }) => createPortMetadata(port));

    return {
        ...baseNodePorts,
        items: orderedPorts,
    };
};

export const createGraphRendererBuilderApi = (): GraphRendererBuilderService => {
    const buildNodeProps = ({ item, position }: GraphRendererBuildNodeInput): UIEngineNodeProps => {
        const width = ensurePositiveDimension(item.layout.width, "layout.width");
        const height = ensurePositiveDimension(item.layout.height, "layout.height");
        const minWidth = ensurePositiveDimension(item.layout.minWidth ?? width, "layout.minWidth");
        const minHeight = ensurePositiveDimension(
            item.layout.minHeight ?? height,
            "layout.minHeight",
        );
        const visualModule = getVisualModule(item);
        const attrs = applyStaticClassPatch(
            mergeAttrs(
                createBaseNodeAttrs({
                    minWidth,
                    minHeight,
                }),
                visualModule?.config.base?.attrs,
            ),
            visualModule?.config.base?.class,
        );
        const markup = visualModule?.config.base?.markup ?? createBaseNodeMarkup();
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
