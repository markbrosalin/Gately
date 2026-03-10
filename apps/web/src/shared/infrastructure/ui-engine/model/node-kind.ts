import type { NodeHashes } from "./nodes-spec";

export type BaseNodeKind = "base:logic" | "base:generator" | "base:display";

const NODE_KIND_BY_HASH: Record<NodeHashes, BaseNodeKind> = {
    BUFFER: "base:logic",
    AND: "base:logic",
    OR: "base:logic",
    NOT: "base:logic",
    NAND: "base:logic",
    NOR: "base:logic",
    XOR: "base:logic",
    XNOR: "base:logic",
    TOGGLE: "base:generator",
    LAMP: "base:display",
    "7_SEG_DISPLAY": "base:display",
    TRUE_CONSTANT: "base:generator",
    FALSE_CONSTANT: "base:generator",
};

export const getNodeKindByHash = (hash: NodeHashes): BaseNodeKind => NODE_KIND_BY_HASH[hash];

