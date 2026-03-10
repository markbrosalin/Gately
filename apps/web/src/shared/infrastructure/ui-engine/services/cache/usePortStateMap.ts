import { Edge, Node } from "@antv/x6";
import type { LogicValueClass } from "../../model";
import { getValueClassFromNode } from "../../lib/logic-values";
import { setValueClassToPort } from "../../lib/logic-values/set-value";
import type { PortStateMapContract } from "./types";

export const createPortStateMap = (): PortStateMapContract => {
    const portCacheMap = new WeakMap<Node, Map<string, PortDomState>>();

    type PortDomState = {
        circle: Element;
        edge?: Edge;
        lastValue: LogicValueClass;
    };

    const save = (node: Node, portId: string, data: { port: Element; edge?: Edge }) => {
        let nodeMap = portCacheMap.get(node);
        if (!nodeMap) {
            nodeMap = new Map();
            portCacheMap.set(node, nodeMap);
        }

        const prev = nodeMap.get(portId);
        nodeMap.set(portId, {
            circle: data.port,
            lastValue: getValueClassFromNode(node, portId),
            edge: data.edge ?? prev?.edge,
        });
    };

    const get = (node: Node, portId: string): PortDomState | undefined => {
        return portCacheMap.get(node)?.get(portId);
    };

    const removeEdge = (node: Node, portId: string) => {
        const portState = get(node, portId);
        if (portState) {
            delete portState.edge;
        }
    };

    const removePort = (node: Node, portId: string) => {
        const nodeMap = portCacheMap.get(node);
        if (nodeMap) {
            nodeMap.delete(portId);
        }
    };

    const removeNode = (node: Node) => {
        portCacheMap.delete(node);
    };

    const updateValue = (node: Node, portId: string, valueClass: LogicValueClass) => {
        const state = get(node, portId);
        if (!state) return;

        if (state.lastValue === valueClass) return;

        setValueClassToPort({ node, portId, valueClass });

        state.lastValue = valueClass;
    };

    const updateEdge = (node: Node, portId: string, edge: Edge) => {
        const state = get(node, portId);
        if (!state) return;

        state.edge = edge;
    };

    return {
        save,
        get,
        updateValue,
        updateEdge,
        removePort,
        removeNodePorts: removeNode,
        removeLinkedEdge: removeEdge,
    };
};

