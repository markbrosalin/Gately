import type { Edge } from "@antv/x6";
import { ApiLinkSingleItem_Result } from "@cnbn/engine";
import {
    buildLinkFromEdge,
    getEdgeData,
    resolveEdgeEndpoints,
} from "@gately/shared/infrastructure/ui-engine/lib/connecting/edgeLink";
import type { BridgeRuntime } from "./runtime";

type WorkspaceEdgeData = {
    linkId?: string;
    endpoints?: {
        input: { itemId: string; pin: string; portId: string };
        output: { itemId: string; pin: string; portId: string };
    };
};

const withLinkId = (edge: Edge, linkId: string): void => {
    edge.setData({
        ...getEdgeData<WorkspaceEdgeData>(edge),
        linkId,
    });
};

export const createEdgeHandlers = (runtime: BridgeRuntime) => {
    const onEdgeConnected = async ({ edge }: { edge: Edge }) => {
        if (runtime.isSilent()) return;

        const tabId = runtime.getActiveTabId();
        if (!tabId) return;

        const endpoints = resolveEdgeEndpoints(edge);
        const link = buildLinkFromEdge(edge);
        if (!endpoints || !link) return;

        const token = { cancelled: false };
        runtime.pendingLinks.set(edge.id, token);

        try {
            const res = (await runtime.runCommand(tabId, () =>
                runtime.logicEngine.call("/item/link", { tabId, link }),
            )) as ApiLinkSingleItem_Result;

            if (token.cancelled) {
                await runtime.runCommand(tabId, () =>
                    runtime.logicEngine.call("/item/unlink", { tabId, linkId: res.linkId }),
                );
                return;
            }

            runtime.withSilent(() => {
                withLinkId(edge, res.linkId);
            });
        } catch (err) {
            console.error("[workspace-bridge] link failed", err);
            runtime.withSilent(() => {
                edge.remove();
            });
        } finally {
            runtime.pendingLinks.delete(edge.id);
        }
    };

    const onEdgeRemoved = async ({ edge }: { edge: Edge }) => {
        if (runtime.isSilent()) return;

        const tabId = runtime.getActiveTabId();
        if (!tabId) return;

        const linkId = getEdgeData<WorkspaceEdgeData>(edge).linkId;
        if (!linkId) {
            const pending = runtime.pendingLinks.get(edge.id);
            if (pending) pending.cancelled = true;
            return;
        }

        try {
            await runtime.runCommand(tabId, () =>
                runtime.logicEngine.call("/item/unlink", { tabId, linkId }),
            );
        } catch (err) {
            console.error("[workspace-bridge] unlink failed", err);
        }
    };

    return {
        onEdgeConnected,
        onEdgeRemoved,
    };
};

