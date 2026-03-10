import { Graph, ValidateConnectionArgs } from "@antv/x6";
import { normalizeConnection } from "./normalizeConnection";
import { hasIncomingOnPort } from "./hasIncomingOnPort";

type ConnectionEndpoints = Pick<
    ValidateConnectionArgs,
    "sourceCell" | "sourcePort" | "targetCell" | "targetPort"
> & { edgeId?: string };

export const isValidConnectionEndpoints = (
    graph: Graph,
    endpoints: ConnectionEndpoints,
): boolean => {
    const normalized = normalizeConnection(endpoints);
    if (!normalized || !normalized.targetCell || !normalized.targetPort) return false;

    return hasIncomingOnPort(graph, normalized.targetCell, normalized.targetPort, endpoints.edgeId)
        ? false
        : true;
};

