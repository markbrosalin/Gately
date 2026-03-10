import type { Node } from "@antv/x6";
import type { CinabonoClient } from "@cnbn/engine-worker";
import type { WorkspaceUIEngine } from "../types";

export type NodeClickContext = {
    node: Node;
    tabId: string;
    uiEngine: WorkspaceUIEngine;
    logicEngine: CinabonoClient;
    runCommand: <T>(command: () => Promise<T>) => Promise<T>;
};

export type NodeClickHandler = (ctx: NodeClickContext) => Promise<void>;


