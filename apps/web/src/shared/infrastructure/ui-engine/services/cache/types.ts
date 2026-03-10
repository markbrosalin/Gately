import type { Edge, Node } from "@antv/x6";
import type { LogicValueClass } from "../../model";

export type PortDomState = {
    circle: Element;
    edge?: Edge;
    lastValue: LogicValueClass;
};

export type EdgeDomState = {
    path: Element;
    lastValue: LogicValueClass;
};

export type PortStateMapContract = {
    save: (node: Node, portId: string, data: { port: Element; edge?: Edge }) => void;
    get: (node: Node, portId: string) => PortDomState | undefined;
    updateValue: (node: Node, portId: string, valueClass: LogicValueClass) => void;
    updateEdge: (node: Node, portId: string, edge: Edge) => void;
    removePort: (node: Node, portId: string) => void;
    removeNodePorts: (node: Node) => void;
    removeLinkedEdge: (node: Node, portId: string) => void;
};

export type EdgeStateMapContract = {
    save: (edge: Edge, path: Element) => void;
    get: (edge: Edge) => EdgeDomState | undefined;
    updateValue: (edge: Edge, valueClass: LogicValueClass) => void;
    remove: (edge: Edge) => void;
};

export type CacheServiceContract = {
    ports: PortStateMapContract;
    edges: EdgeStateMapContract;
};

