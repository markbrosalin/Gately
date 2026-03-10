import type { LogicValueClass, PinSide } from "@engine-model/graph-renderer";

export const buildPortClass = (side: PinSide, signalClass: LogicValueClass): string => {
    const base = side === "input" ? "port port-input" : "port port-output";
    return `${base} ${signalClass}`;
};
