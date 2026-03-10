/* eslint-disable @typescript-eslint/no-explicit-any */
import { getEdgeData, resolveEdgeEndpoints } from "../../lib/connecting/edgeLink";
import type { EdgeData, UIEnginePlugin } from "../../model";

export const edgeLifecycleCachePlugin: UIEnginePlugin = {
    name: "tools:edgeLifecycleCachePlugin",
    apply(graph, ctx) {
        const cache = ctx.getService("cache");
        const edgeMap = cache.edges;
        const portMap = cache.ports;

        const onEdgeConnected = (data: any) => {
            const domPath = data.view.container.querySelector("path.connection");
            if (!domPath) return;

            // save endpoints to edge data
            const edgeData = resolveEdgeEndpoints(data.edge);
            if (!edgeData?.to) return;

            data.edge.setData(edgeData);
            // save edge to edgeMap
            edgeMap.save(data.edge, domPath);
            edgeMap.updateValue(data.edge, "value-hiz");
            portMap.updateEdge(edgeData.to.node, edgeData.to.portId, data.edge);
        };

        const onEdgeRemoved = (data: any) => {
            const edgeData = resolveEdgeEndpoints(data.edge) ?? getEdgeData<EdgeData>(data.edge);

            if (edgeData?.to) {
                portMap.updateValue(edgeData.to.node, edgeData.to.portId, "value-hiz");
                portMap.removeLinkedEdge(edgeData.to.node, edgeData.to.portId);
            }
            edgeMap.remove(data.edge);
        };

        graph.on("edge:connected", onEdgeConnected);
        graph.on("edge:removed", onEdgeRemoved);

        return () => {
            graph.off("edge:connected", onEdgeConnected);
            graph.off("edge:removed", onEdgeRemoved);
        };
    },
};

