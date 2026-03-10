/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UIEnginePlugin } from "../../model";

export const nodeLifecycleCachePlugin: UIEnginePlugin = {
    name: "tools:nodeLifecycleCachePlugin",
    apply(graph, ctx) {
        const map = ctx.getService("cache").ports;

        const onNodeRemoved = (data: any) => {
            map.removeNodePorts(data.node);
        };

        graph.on("node:removed", (data) => {
            onNodeRemoved(data);
        });

        return () => {
            graph.off("node:removed", onNodeRemoved);
        };
    },
};

