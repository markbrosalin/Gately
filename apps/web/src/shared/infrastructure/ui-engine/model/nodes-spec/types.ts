export type LogicNodeHashes = "BUFFER" | "AND" | "OR" | "NOT" | "NAND" | "NOR" | "XOR" | "XNOR";

export type GeneratorNodeHashes = "TOGGLE" | "TRUE_CONSTANT" | "FALSE_CONSTANT";
export type DisplayNodeHashes = "LAMP" | "7_SEG_DISPLAY";

export type NodeHashes = LogicNodeHashes | GeneratorNodeHashes | DisplayNodeHashes;

