import type { Graph } from "@antv/x6";
import type { CinabonoClient } from "@cnbn/engine-worker";
import type { WorkspaceUIEngine } from "../types";

export type AttachWorkspaceBridgeOptions = {
    graph: Graph;
    uiEngine: WorkspaceUIEngine;
    logicEngine: CinabonoClient;
    getActiveTabId: () => string | undefined;
    requestSimulationNow?: () => void | Promise<void>;
};

export const createBridgeRuntime = (opts: AttachWorkspaceBridgeOptions) => {
    const { graph, uiEngine, logicEngine, getActiveTabId, requestSimulationNow } = opts;

    let silentDepth = 0;
    const pendingLinks = new Map<string, { cancelled: boolean }>();

    const isSilent = () =>
        silentDepth > 0 || (graph as unknown as { __bridgeSilent?: boolean }).__bridgeSilent;

    const withSilent = (fn: () => void) => {
        silentDepth += 1;
        try {
            fn();
        } finally {
            silentDepth -= 1;
        }
    };

    const runCommand = async <T>(_tabId: string, command: () => Promise<T>): Promise<T> => {
        const result = await command();
        if (requestSimulationNow) {
            await requestSimulationNow();
        }
        return result;
    };

    return {
        graph,
        uiEngine,
        logicEngine,
        pendingLinks,
        isSilent,
        withSilent,
        getActiveTabId,
        runCommand,
    };
};

export type BridgeRuntime = ReturnType<typeof createBridgeRuntime>;

