import type { GraphRendererInstanceService } from "../instance";
import type { GraphRendererNodesService } from "../nodes";
import type { GraphRendererSelectionService } from "../selection";
import type { GraphRendererRemovalService } from "./types";

export const createGraphRendererRemovalApi = (
    instance: GraphRendererInstanceService,
    nodes: GraphRendererNodesService,
    selection: GraphRendererSelectionService,
): GraphRendererRemovalService => {
    const removeSelection = (): void => {
        const graph = instance.graph();
        if (!graph) {
            return;
        }

        const cells = selection.selectedCells();
        if (cells.length === 0) {
            return;
        }

        graph.removeCells(cells);
        selection.clearSelection();
    };

    const removeNode = (nodeId: string): boolean => {
        const node = nodes.getNode(nodeId);
        if (!node) {
            return false;
        }

        nodes.removeNode(nodeId);
        return true;
    };

    const removeEdge = (edgeId: string): boolean => {
        const graph = instance.graph();
        if (!graph) {
            return false;
        }

        const edge = graph.getCellById(edgeId);
        if (!edge || !edge.isEdge?.()) {
            return false;
        }

        graph.removeEdge(edgeId);
        return true;
    };

    return {
        removeSelection,
        removeNode,
        removeEdge,
    };
};

export const createGraphRendererRemovalService = (
    instance: GraphRendererInstanceService,
    nodes: GraphRendererNodesService,
    selection: GraphRendererSelectionService,
): GraphRendererRemovalService => {
    return createGraphRendererRemovalApi(instance, nodes, selection);
};
