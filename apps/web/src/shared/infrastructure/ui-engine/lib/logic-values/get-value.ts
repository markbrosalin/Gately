import { Node } from "@antv/x6";
import { LogicValueClass } from "../../model";
import { LOGIC_VALUE_CLASSES } from "../../model/constants";

export const pickLogicValueClass = (className: string): LogicValueClass => {
    if (!className) return "value-hiz";
    const tokens = className.split(/\s+/).filter(Boolean);
    return tokens.find((t) =>
        (LOGIC_VALUE_CLASSES as readonly string[]).includes(t),
    ) as LogicValueClass;
};

export const getValueClassFromElement = (el: Element): LogicValueClass => {
    return pickLogicValueClass(el.classList.value);
};

export const getValueClassFromNode = (node: Node, portId: string): LogicValueClass => {
    return pickLogicValueClass(node.getPortProp(portId, "attrs/circle/class"));
};

