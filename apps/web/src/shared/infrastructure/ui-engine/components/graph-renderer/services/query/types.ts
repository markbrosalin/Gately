import type { Graph } from "@antv/x6";

export type GraphRendererQueryService = {
    graph: () => Graph | undefined;
    container: () => HTMLDivElement | undefined;
    activeWorkspaceId: () => string | undefined;
    isOpen: () => boolean;
    selectionCount: () => number;
};

