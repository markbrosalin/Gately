import { LogicValue } from "@cnbn/schema";
import { CLASS_BY_LOGIC_VALUE, LOGIC_VALUE_BY_CLASS } from "../../model/constants";
import { LogicValueClass } from "../../model";

export const logicValueToClass = (value?: LogicValue | null): LogicValueClass => {
    if (!value) return "value-x";
    return CLASS_BY_LOGIC_VALUE[value] ?? "value-x";
};

export const logicClassToValue = (valueClass?: string | null): LogicValue => {
    if (!valueClass) return "X";
    return LOGIC_VALUE_BY_CLASS[valueClass as LogicValueClass] ?? "X";
};

