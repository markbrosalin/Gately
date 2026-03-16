import { Graph } from "@antv/x6";
import { createGraphRendererOptions } from "../../helpers";
import type { GraphRendererConnectingService } from "../connecting";
import type { GraphRendererServiceContext } from "../types";
import type {
    GraphRendererLifecycleContext,
    GraphRendererLifecycleListener,
    GraphRendererInstanceMountInput,
    GraphRendererInstanceService,
    GraphRendererRuntime,
} from "./types";

const createInitialRuntime = (): GraphRendererRuntime => ({
    container: undefined,
    graph: undefined,
});

export const createGraphRendererInstanceService = (
    ctx: GraphRendererServiceContext,
    connecting: GraphRendererConnectingService,
): GraphRendererInstanceService => {
    let runtime = createInitialRuntime();
    const graphMountListeners = new Set<GraphRendererLifecycleListener>();
    const graphUnmountListeners = new Set<GraphRendererLifecycleListener>();

    const container = () => runtime.container;
    const graph = () => runtime.graph;

    const onGraphMount = (listener: GraphRendererLifecycleListener): (() => void) => {
        graphMountListeners.add(listener);
        return () => {
            graphMountListeners.delete(listener);
        };
    };
    const onGraphUnmount = (listener: GraphRendererLifecycleListener): (() => void) => {
        graphUnmountListeners.add(listener);
        return () => {
            graphUnmountListeners.delete(listener);
        };
    };
    const emitLifecycle = (
        listeners: Set<GraphRendererLifecycleListener>,
        payload: GraphRendererLifecycleContext,
    ): void => {
        listeners.forEach((listener) => {
            try {
                listener(payload);
            } catch (error) {
                ctx.external.hooks?.onError?.({
                    label: "graph-renderer lifecycle",
                    stage: "runtime",
                    error,
                });
                console.error("[UIEngine] graph-renderer lifecycle listener failed", error);
            }
        });
    };

    const unmount = (): void => {
        const currentGraph = runtime.graph;
        const currentContainer = runtime.container;

        if (currentGraph && currentContainer) {
            emitLifecycle(graphUnmountListeners, {
                graph: currentGraph,
                container: currentContainer,
            });
        }

        runtime = createInitialRuntime();

        if (!currentGraph) return;

        try {
            currentGraph.dispose();
        } catch (error) {
            ctx.external.hooks?.onError?.({
                label: "component",
                name: "graph-renderer",
                stage: "dispose",
                error,
            });
            throw error;
        }
    };

    const mount = ({ container }: GraphRendererInstanceMountInput): Graph => {
        if (runtime.graph) {
            unmount();
        }

        const nextGraph = new Graph(
            createGraphRendererOptions(container, connecting.buildConfig()),
        );

        runtime = {
            container,
            graph: nextGraph,
        };

        emitLifecycle(graphMountListeners, {
            graph: nextGraph,
            container,
        });

        return nextGraph;
    };

    return {
        container,
        graph,
        onGraphMount,
        onGraphUnmount,
        mount,
        unmount,
    };
};
