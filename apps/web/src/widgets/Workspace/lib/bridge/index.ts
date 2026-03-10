import { createEdgeHandlers } from "./edge-handlers";
import { createNodeHandlers } from "./node-event-handlers";
import { createBridgeRuntime } from "./runtime";
import type { AttachWorkspaceBridgeOptions } from "./runtime";

export const attachWorkspaceBridge = (opts: AttachWorkspaceBridgeOptions): (() => void) => {
    const runtime = createBridgeRuntime(opts);

    const { onEdgeConnected, onEdgeRemoved } = createEdgeHandlers(runtime);
    const { onNodeClick, onNodeRemovedAny } = createNodeHandlers(runtime);

    runtime.graph.on("edge:connected", onEdgeConnected);
    runtime.graph.on("edge:removed", onEdgeRemoved);
    runtime.graph.on("node:removed", onNodeRemovedAny);
    runtime.graph.on("node:click", onNodeClick);

    return () => {
        runtime.graph.off("edge:connected", onEdgeConnected);
        runtime.graph.off("edge:removed", onEdgeRemoved);
        runtime.graph.off("node:removed", onNodeRemovedAny);
        runtime.graph.off("node:click", onNodeClick);
    };
};

