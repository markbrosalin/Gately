import type { GraphRendererInstanceService } from "../instance";
import type { GraphRendererSelectionService } from "../selection";
import type { GraphRendererServiceContext } from "../types";
import type { GraphRendererQueryService } from "./types";

export const createGraphRendererQueryApi = (
    instance: GraphRendererInstanceService,
    selection: GraphRendererSelectionService,
): GraphRendererQueryService => {
    const graph = instance.graph;
    const container = instance.container;
    const activeWorkspaceId = instance.activeWorkspaceId;

    const isOpen = (): boolean => Boolean(graph());
    const hasSelection = (): boolean => selection.hasSelection();
    const selectionCount = (): number => selection.selectedCells().length;
    const selectedCellIds = (): string[] => selection.selectedCells().map((cell) => cell.id);
    const selectedNodeIds = (): string[] => selection.selectedNodes().map((node) => node.id);
    const selectedEdgeIds = (): string[] => selection.selectedEdges().map((edge) => edge.id);

    return {
        graph,
        container,
        activeWorkspaceId,
        isOpen,
        hasSelection,
        selectionCount,
        selectedCellIds,
        selectedNodeIds,
        selectedEdgeIds,
    };
};

export const createGraphRendererQueryService = (
    ctx: GraphRendererServiceContext,
): GraphRendererQueryService => {
    return createGraphRendererQueryApi(ctx.getService("instance"), ctx.getService("selection"));
};

