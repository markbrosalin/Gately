import type { Graph } from "@antv/x6";

export type GraphRendererInstanceMountInput = {
    container: HTMLDivElement;
};

export type GraphRendererRuntime = {
    container?: HTMLDivElement;
    graph?: Graph;
};

export type GraphRendererLifecycleContext = Required<GraphRendererRuntime>;

export type GraphRendererLifecycleListener = (ctx: GraphRendererLifecycleContext) => void;

export type GraphRendererInstanceLifecycleApi = {
    onGraphMount: (listener: GraphRendererLifecycleListener) => () => void;
    onGraphUnmount: (listener: GraphRendererLifecycleListener) => () => void;
};

export type GraphRendererInstanceService = {
    container: () => HTMLDivElement | undefined;
    graph: () => Graph | undefined;
    onGraphMount: GraphRendererInstanceLifecycleApi["onGraphMount"];
    onGraphUnmount: GraphRendererInstanceLifecycleApi["onGraphUnmount"];
    mount: (input: GraphRendererInstanceMountInput) => Graph;
    unmount: () => void;
};
