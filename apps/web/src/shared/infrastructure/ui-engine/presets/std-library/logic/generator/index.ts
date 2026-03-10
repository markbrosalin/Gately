import { FALSE_CONSTANT_GENERATOR_ITEM } from "./false-constant";
import { TOGGLE_GENERATOR_ITEM } from "./toggle";
import { TRUE_CONSTANT_GENERATOR_ITEM } from "./true-constant";

export * from "./false-constant";
export * from "./toggle";
export * from "./true-constant";

export const LOGIC_GENERATOR_ITEMS = [
    FALSE_CONSTANT_GENERATOR_ITEM,
    TRUE_CONSTANT_GENERATOR_ITEM,
    TOGGLE_GENERATOR_ITEM,
];

