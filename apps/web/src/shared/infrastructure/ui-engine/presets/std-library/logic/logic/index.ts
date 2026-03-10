import { AND_LOGIC_ITEM } from "./and";
import { BUFFER_LOGIC_ITEM } from "./buffer";
import { NAND_LOGIC_ITEM } from "./nand";
import { NOR_LOGIC_ITEM } from "./nor";
import { NOT_LOGIC_ITEM } from "./not";
import { OR_LOGIC_ITEM } from "./or";
import { XNOR_LOGIC_ITEM } from "./xnor";
import { XOR_LOGIC_ITEM } from "./xor";

export * from "./and";
export * from "./or";
export * from "./buffer";
export * from "./not";
export * from "./nor";
export * from "./nand";
export * from "./xnor";
export * from "./xor";

export const LOGIC_LOGIC_ITEMS = [
    AND_LOGIC_ITEM,
    OR_LOGIC_ITEM,
    BUFFER_LOGIC_ITEM,
    NOT_LOGIC_ITEM,
    NOR_LOGIC_ITEM,
    NAND_LOGIC_ITEM,
    XOR_LOGIC_ITEM,
    XNOR_LOGIC_ITEM,
];
