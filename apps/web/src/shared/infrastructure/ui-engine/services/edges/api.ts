import type { Graph } from "@antv/x6";
import type { EdgeRouterMode, LogicValueClass, UIEngineContext } from "../../model";

export type EdgeService = ReturnType<typeof useEdgeService>;

export const useEdgeService = (graph: Graph, ctx: UIEngineContext) => {
    const cache = ctx.getService("cache");
    const edgeMap = cache.edges;

    const setIncomingPortValueClass = (
        nodeId: string,
        toPortId: string,
        valueClass: LogicValueClass,
    ): void => {
        const node = ctx.getService("nodes").getNode(nodeId);
        if (!node) return;

        const portState = cache.ports.get(node, toPortId);

        if (!portState || !portState.edge) return;

        edgeMap.updateValue(portState.edge, valueClass);
    };

    const setEdgeRouterMode = (mode: EdgeRouterMode) => {
        graph.options.connecting.router = { name: mode };
        graph.getEdges().forEach((edge) => edge.setRouter(mode));
    };

    return {
        setEdgeRouterMode,
        setIncomingPortValueClass,
    };
};

