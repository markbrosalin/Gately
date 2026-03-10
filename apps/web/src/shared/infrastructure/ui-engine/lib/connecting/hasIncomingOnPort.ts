import type { Graph, Cell } from "@antv/x6";

export const hasIncomingOnPort = (
    graph: Graph,
    targetCell: Cell,
    targetPort?: string | null,
    edgeId?: string | null,
) => {
    if (!targetPort) return true;
    const incoming = graph.getIncomingEdges(targetCell) ?? [];
    return incoming.some((edge) => {
        if (edgeId && edge.id === edgeId) return false;
        return edge.getTargetPortId() === targetPort;
    });
};

