import type { Graph } from "@antv/x6";

export type GraphRendererInstanceMountInput = {
    container: HTMLDivElement;
};

export type GraphRendererInstanceService = {
    container: () => HTMLDivElement | undefined;
    graph: () => Graph | undefined;
    mount: (input: GraphRendererInstanceMountInput) => Graph;
    unmount: () => void;
};
