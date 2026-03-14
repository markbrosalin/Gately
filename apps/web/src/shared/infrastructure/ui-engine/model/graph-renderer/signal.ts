import type { LogicValue } from "@cnbn/schema";
import { LOGIC_VALUE_CLASSES } from "../constants";

export type LogicValueClass = (typeof LOGIC_VALUE_CLASSES)[number];

export type PortSide = "left" | "right";
export type PinSide = "input" | "output";

export type PinRef = {
    side: PinSide;
    index: string;
};

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

