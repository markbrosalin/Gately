import { Edge, Node } from "@antv/x6";
import { LogicValueClass } from "@gately/shared/lib/logic-values";
import { removeLogicValueClass } from "./remove-value";

export const setValueClassToEdge = ({
    edge,
    valueClass,
}: {
    edge: Edge;
    valueClass: LogicValueClass;
}) => {
    const current = edge.getAttrByPath?.("line/class") as string;
    const base = removeLogicValueClass(current);
    const merged = `${base} ${valueClass}`.trim();
    edge.setAttrByPath("line/class", merged);
};

export const setValueClassToPort = ({
    node,
    portId,
    valueClass,
}: {
    node: Node;
    portId: string;
    valueClass: LogicValueClass;
}) => {
    const current = node.getPortProp(portId, "attrs/circle/class") as string;

    const base = removeLogicValueClass(current);
    const merged = `${base} ${valueClass}`.trim();
    node.setPortProp(portId, "attrs/circle/class", merged);
};

