import type { LogicValue } from "@cnbn/schema";

export type LogicValueClass = "value-true" | "value-false" | "value-x" | "value-hiz";

export const LOGIC_VALUE_CLASSES: LogicValueClass[] = [
    "value-true",
    "value-false",
    "value-x",
    "value-hiz",
];

const CLASS_BY_LOGIC_VALUE: Record<LogicValue, LogicValueClass> = {
    "1": "value-true",
    "0": "value-false",
    X: "value-x",
    Z: "value-hiz",
    C: "value-x",
};

export const toLogicValueClass = (value?: LogicValue | null): LogicValueClass => {
    if (!value) return "value-x";
    return CLASS_BY_LOGIC_VALUE[value] ?? "value-x";
};

