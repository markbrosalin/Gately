import type { Graph } from "@antv/x6";

export type GraphRendererQueryService = {
    graph: () => Graph | undefined;
    container: () => HTMLDivElement | undefined;
    activeWorkspaceId: () => string | undefined;
    isMounted: () => boolean;
    hasSelection: () => boolean;
    selectionCount: () => number;
    selectedCellIds: () => string[];
    selectedNodeIds: () => string[];
    selectedEdgeIds: () => string[];
};

