import type { Edge } from "@antv/x6";
import type { ItemLink } from "@cnbn/schema";
import { decodePortId } from "../ports";
import type { EdgeData, EdgeEndpoint } from "../../model";

export const getEdgeData = <T extends object = Record<string, unknown>>(edge: Edge): T =>
    (edge.getData() ?? {}) as T;

export const resolveEdgeEndpoints = (edge: Edge): EdgeData | null => {
    const sourceCell = edge.getSourceCell();
    const sourcePort = edge.getSourcePortId();

    if (!sourceCell || !sourcePort) return null;
    if (!sourceCell.isNode?.()) return null;

    const source = decodePortId(sourcePort);
    const sourceEndpoint: EdgeEndpoint = {
        node: sourceCell,
        pin: source.id,
        portId: sourcePort,
    };

    const targetCell = edge.getTargetCell();
    const targetPort = edge.getTargetPortId();

    if (source.side === "right") {
        if (!targetCell || !targetPort || !targetCell.isNode?.()) {
            return { from: sourceEndpoint };
        }

        const target = decodePortId(targetPort);
        if (target.side !== "left") {
            return { from: sourceEndpoint };
        }

        return {
            from: sourceEndpoint,
            to: {
                node: targetCell,
                pin: target.id,
                portId: targetPort,
            },
        };
    }

    if (!targetCell || !targetPort || !targetCell.isNode?.()) {
        return null;
    }

    const target = decodePortId(targetPort);
    if (source.side === "left" && target.side === "right") {
        return {
            to: {
                node: sourceCell,
                pin: source.id,
                portId: sourcePort,
            },
            from: {
                node: targetCell,
                pin: target.id,
                portId: targetPort,
            },
        };
    }

    return null;
};

export const buildLinkFromEndpoints = (endpoints: EdgeData): ItemLink | undefined => {
    if (!endpoints.to) return;

    return {
        fromItemId: endpoints.from.node.id,
        fromPin: endpoints.from.pin,
        toItemId: endpoints.to.node.id,
        toPin: endpoints.to.pin,
    };
};

export const buildLinkFromEdge = (edge: Edge): ItemLink | undefined => {
    const endpoints = resolveEdgeEndpoints(edge);
    if (!endpoints) return;
    return buildLinkFromEndpoints(endpoints);
};

