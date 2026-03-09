import type { Node, NodeProperties } from "@antv/x6";
import { Hash, HierarchyPath, KindKey, LogicValue } from "@cnbn/schema";
import { LOGIC_VALUE_CLASSES } from "../constants";
import type { CatalogItemKind } from "../catalog/item";
import type { CatalogItemRef } from "../catalog/ref";

export type LogicValueClass = (typeof LOGIC_VALUE_CLASSES)[number];

export type PortSide = "left" | "right";
export type PinSide = "input" | "output";
export type PinRef = { side: PinSide; index: string };

export type PortSignalClassUpdate = {
    nodeId: string;
    portId: string;
    signalClass: LogicValueClass;
};

export type PortValueUpdate = {
    nodeId: string;
    portId: string;
    value: LogicValue;
};

export type PinUpdate = {
    elementId: string;
    pinRef: PinRef;
    value: LogicValue;
};

export type UIEngineNodeData = {
    kind: KindKey | CatalogItemKind;
    hash?: Hash;
    path?: HierarchyPath;
    ref?: CatalogItemRef;
    refKey?: string;
};

export type UIEngineNodeProps = Omit<NodeProperties, "data"> & {
    data: UIEngineNodeData;
};

export type EdgeRouterMode = "manhattan" | "metro";

export type EdgeEndpoint = {
    node: Node;
    pin: string;
    portId: string;
};

export type EdgeData = {
    from: EdgeEndpoint;
    to?: EdgeEndpoint;
};
