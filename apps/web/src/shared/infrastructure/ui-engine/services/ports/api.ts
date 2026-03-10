import type { Graph, Node } from "@antv/x6";
import type { LogicValue } from "@cnbn/schema";
import {
    decodePortId,
    getValueClassFromNode,
    logicClassToValue,
    logicValueToClass,
    pinRefToPortId,
    setValueClassToPort,
} from "../../lib";
import type { LogicValueClass, PinRef, PinSide, UIEngineContext } from "../../model";

export type PortService = ReturnType<typeof usePortService>;

export const usePortService = (_graph: Graph, ctx: UIEngineContext) => {
    const portMap = ctx.getService("cache").ports;

    const _setPortValueClass = (
        nodeId: string,
        portId: string,
        valueClass: LogicValueClass,
    ): void => {
        const node = ctx.getService?.("nodes").getNode(nodeId);
        if (!node) return;

        const port = portMap.get(node, portId);
        if (!port) {
            const currentValueClass = getValueClassFromNode(node, portId);
            if (currentValueClass === valueClass) return;

            setValueClassToPort({ node, portId, valueClass });
            return;
        }

        portMap.updateValue(node, portId, valueClass);
    };

    const setPortValue = (elementId: string, pinRef: PinRef, value: LogicValue): void => {
        const portId = pinRefToPortId(pinRef);
        const valueClass = logicValueToClass(value);
        _setPortValueClass(elementId, portId, valueClass);
    };

    const readSignalsFromNode = (
        node: Node,
        side: PinSide,
    ): Record<string, LogicValue | undefined> => {
        const targetSide = side === "input" ? "left" : "right";
        const signals: Record<string, LogicValue | undefined> = {};

        const ports = node.getPorts?.() ?? [];
        for (const port of ports) {
            if (!port?.id || typeof port.id !== "string") continue;

            const decoded = decodePortId(port.id);
            if (decoded.side !== targetSide) continue;

            const valueClass = getValueClassFromNode(node, port.id);
            signals[decoded.id] = logicClassToValue(valueClass);
        }

        return signals;
    };

    return {
        setPortValue,
        readSignalsFromNode,
    };
};

