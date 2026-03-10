import type { Node } from "@antv/x6";
import { handleTogglePrimaryClick } from "./handlers/toggle";
import { readNodeHash } from "./runtime";
import type { NodeClickHandler } from "./types";

const PRIMARY_NODE_CLICK_HANDLERS: Record<string, NodeClickHandler> = {
    TOGGLE: handleTogglePrimaryClick,
};

export const resolvePrimaryNodeClickHandler = (node: Node): NodeClickHandler | undefined => {
    const hash = readNodeHash(node);
    if (!hash) return;
    return PRIMARY_NODE_CLICK_HANDLERS[hash];
};

export type { NodeClickContext, NodeClickHandler } from "./types";


