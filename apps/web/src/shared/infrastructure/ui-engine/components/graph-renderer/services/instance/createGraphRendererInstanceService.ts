import { Graph } from "@antv/x6";
import { createGraphRendererOptions } from "../../helpers";
import type { GraphRendererServiceContext } from "../types";
import type {
    GraphRendererInstanceOpenInput,
    GraphRendererInstanceService,
} from "./types";

type GraphRendererRuntime = {
    workspaceId: string | undefined;
    container: HTMLDivElement | undefined;
    graph: Graph | undefined;
    disposers: Array<() => void>;
};

const createInitialRuntime = (): GraphRendererRuntime => ({
    workspaceId: undefined,
    container: undefined,
    graph: undefined,
    disposers: [],
});

export const createGraphRendererInstanceService = (
    ctx: GraphRendererServiceContext,
): GraphRendererInstanceService => {
    let runtime = createInitialRuntime();

    const activeWorkspaceId = () => runtime.workspaceId;
    const container = () => runtime.container;
    const graph = () => runtime.graph;

    const close = (): void => {
        const currentGraph = runtime.graph;
        const currentDisposers = runtime.disposers;

        runtime = createInitialRuntime();

        currentDisposers.reverse().forEach((dispose) => {
            try {
                dispose();
            } catch (error) {
                ctx.external.hooks?.onError?.({
                    label: "graph-renderer plugin",
                    stage: "dispose",
                    error,
                });
                console.error("[UIEngine] graph-renderer plugin dispose failed", error);
            }
        });

        if (!currentGraph) {
            return;
        }

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

    const open = ({ workspaceId, container }: GraphRendererInstanceOpenInput): Graph => {
        if (runtime.graph) {
            close();
        }

        const nextGraph = new Graph(createGraphRendererOptions(container));

        runtime = {
            workspaceId,
            container,
            graph: nextGraph,
            disposers: [],
        };

        return nextGraph;
    };

    return {
        activeWorkspaceId,
        container,
        graph,
        open,
        close,
    };
};
