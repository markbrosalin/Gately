import { Graph } from "@antv/x6";
import { createSignal } from "solid-js";
import { createGraphRendererOptions } from "../../helpers";
import type { GraphRendererConnectingService } from "../connecting";
import type { GraphRendererServiceContext } from "../types";
import type { GraphRendererInstanceMountInput, GraphRendererInstanceService } from "./types";

export const createGraphRendererInstanceService = (
    ctx: GraphRendererServiceContext,
    connecting: GraphRendererConnectingService,
): GraphRendererInstanceService => {
    const [container, setContainer] = createSignal<HTMLDivElement | undefined>(undefined);
    const [graph, setGraph] = createSignal<Graph | undefined>(undefined);

    const unmount = (): void => {
        const currentGraph = graph();

        setGraph(undefined);
        setContainer(undefined);

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
        if (graph()) {
            unmount();
        }

        const nextGraph = new Graph(
            createGraphRendererOptions(container, connecting.buildConfig()),
        );

        setContainer(container);
        setGraph(nextGraph);

        return nextGraph;
    };

    return {
        container,
        graph,
        mount,
        unmount,
    };
};
