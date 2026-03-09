import type { GraphRendererInstanceService } from "../instance";
import type { GraphRendererServiceContext } from "../types";
import type { GraphRendererQueryService } from "./types";

export const createGraphRendererQueryApi = (
    instance: GraphRendererInstanceService,
): GraphRendererQueryService => {
    const graph = instance.graph;
    const container = instance.container;
    const activeWorkspaceId = instance.activeWorkspaceId;

    const isOpen = (): boolean => Boolean(graph());

    const selectionCount = (): number => graph()?.getSelectedCellCount?.() ?? 0;

    return {
        graph,
        container,
        activeWorkspaceId,
        isOpen,
        selectionCount,
    };
};

export const createGraphRendererQueryService = (
    ctx: GraphRendererServiceContext,
): GraphRendererQueryService => {
    return createGraphRendererQueryApi(ctx.getService("instance"));
};
