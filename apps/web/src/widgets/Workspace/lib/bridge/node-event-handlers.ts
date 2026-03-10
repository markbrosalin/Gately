import type { Node } from "@antv/x6";
import { resolvePrimaryNodeClickHandler } from "../node-interactions";
import type { BridgeRuntime } from "./runtime";

export const createNodeHandlers = (runtime: BridgeRuntime) => {
    const onNodeRemoved = async ({ node }: { node: Node }) => {
        if (runtime.isSilent()) return;

        const tabId = runtime.getActiveTabId();
        if (!tabId) return;

        try {
            await runtime.runCommand(tabId, () =>
                runtime.logicEngine.call("/item/remove", { tabId, itemId: node.id }),
            );
        } catch (err) {
            console.error("[workspace-bridge] remove item failed", err);
        }
    };

    const onNodeRemovedAny = (payload: { node?: Node; cell?: Node }) => {
        const node = payload.node ?? payload.cell;
        if (!node) return;
        void onNodeRemoved({ node });
    };

    const onNodeClick = ({ node, e }: { node: Node; e: MouseEvent }) => {
        if (runtime.isSilent()) return;
        if ((e?.button ?? 0) !== 0) return;

        const handler = resolvePrimaryNodeClickHandler(node);
        if (!handler) return;

        const target = e?.target as Element | null;
        if (target?.closest?.(".x6-port")) return;

        const tabId = runtime.getActiveTabId();
        if (!tabId) return;

        void handler({
            node,
            tabId,
            uiEngine: runtime.uiEngine,
            logicEngine: runtime.logicEngine,
            runCommand: <T>(command: () => Promise<T>) => runtime.runCommand(tabId, command),
        });
    };

    return {
        onNodeClick,
        onNodeRemovedAny,
    };
};


