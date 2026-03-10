import { ItemBuilderResult } from "@cnbn/engine";
import { hasItemInputPins, hasItemOutputPins } from "@cnbn/schema";
import { XYCoords } from "@gately/shared/types";
import { buildPortClass, encodePortId, logicValueToClass } from "../../../lib";
import type { PortMetadata } from "@antv/x6/lib/model/port";
import { UIEngineNodeProps } from "../../../model";
import type { AnyVisualBinding } from "../../../model/visual";
import { calcNodeSize } from "./calcNodeSize";
import { STROKE_WIDTH } from "../../../model";

type MapOptions = {
    position?: XYCoords;
};

export type BuildNodePropsDeps = {
    getVisualBinding: (hash: string) => AnyVisualBinding | undefined;
};

const toPorts = (item: ItemBuilderResult["builtItem"]): PortMetadata[] => {
    const ports: PortMetadata[] = [];

    if (hasItemInputPins(item)) {
        const inputGroup = item.hash === "LAMP" ? "bottom" : "left";

        for (const [id, pin] of Object.entries(item.inputPins ?? {})) {
            const signalClass = logicValueToClass(pin?.value);
            ports.push({
                id: encodePortId({ side: "left", id }),
                group: inputGroup,
                attrs: {
                    circle: {
                        class: buildPortClass("input", signalClass),
                    },
                },
            });
        }
    }

    if (hasItemOutputPins(item)) {
        for (const [id, pin] of Object.entries(item.outputPins ?? {})) {
            const signalClass = logicValueToClass(pin?.value);
            ports.push({
                id: encodePortId({ side: "right", id }),
                group: "right",
                attrs: {
                    circle: {
                        class: buildPortClass("output", signalClass),
                    },
                },
            });
        }
    }

    return ports;
};

export const buildNodeProps = (
    result: ItemBuilderResult,
    deps: BuildNodePropsDeps,
    options?: MapOptions,
): UIEngineNodeProps => {
    const item = result.builtItem;
    const visualPreset = deps.getVisualBinding(item.hash)?.preset;
    if (!visualPreset) {
        throw new Error(`[UIEngine][nodes] visual preset "${item.hash}" is not registered`);
    }
    const minWidth = visualPreset.minWidth;
    const minHeight = visualPreset.minHeight;
    const shape = visualPreset.nodeName;
    const inCount = hasItemInputPins(item) ? Object.keys(item.inputPins ?? {}).length : 0;
    const outCount = hasItemOutputPins(item) ? Object.keys(item.outputPins ?? {}).length : 0;
    const { width, height } = calcNodeSize({
        minWidth,
        minHeight,
        pinCount: Math.max(inCount, outCount),
    });
    const pos = options?.position ?? { x: 122, y: 122 };

    return {
        id: item.id,
        shape,
        x: pos.x,
        y: pos.y,
        width: width + STROKE_WIDTH,
        height: height + STROKE_WIDTH,
        data: {
            hash: item.hash,
            path: item.path,
            kind: item.kind,
        },
        ports: toPorts(item),
    };
};

