import type { Graph } from "@antv/x6";

export type GraphRendererInstanceOpenInput = {
    workspaceId: string;
    container: HTMLDivElement;
};

export type GraphRendererInstanceService = {
    activeWorkspaceId: () => string | undefined;
    container: () => HTMLDivElement | undefined;
    graph: () => Graph | undefined;
    open: (input: GraphRendererInstanceOpenInput) => Graph;
    close: () => void;
};

