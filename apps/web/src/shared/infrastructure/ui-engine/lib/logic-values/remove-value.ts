import { LogicValueClass } from "../../model";
import { LOGIC_VALUE_CLASSES } from "../../model/constants";

export const removeLogicValueClass = (className?: string): string => {
    if (!className) return "";
    const tokens = className.split(/\s+/).filter(Boolean);
    const filtered = tokens.filter(
        (token) => !LOGIC_VALUE_CLASSES.includes(token as LogicValueClass),
    );
    return filtered.join(" ");
};

