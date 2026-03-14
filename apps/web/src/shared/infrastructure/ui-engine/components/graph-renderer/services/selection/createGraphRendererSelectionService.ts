import { Selection, type Cell, type Edge, type Node } from "@antv/x6";
import type { GraphRendererInstanceService } from "../instance";
import type { GraphRendererSelectionService } from "./types";

export const createGraphRendererSelectionApi = (
    instance: GraphRendererInstanceService,
): GraphRendererSelectionService => {
    let installedGraph: ReturnType<GraphRendererInstanceService["graph"]>;

    const selectedCells = (): Cell[] => instance.graph()?.getSelectedCells?.() ?? [];

    const selectedNodes = (): Node[] =>
        selectedCells().filter((cell): cell is Node => cell?.isNode?.());

    const selectedEdges = (): Edge[] =>
        selectedCells().filter((cell): cell is Edge => cell?.isEdge?.());

    const clearSelection = (): void => {
        instance.graph()?.cleanSelection?.();
    };

    const hasSelection = (): boolean => selectedCells().length > 0;

    const install = (): void => {
        const graph = instance.graph();
        if (!graph || installedGraph === graph) {
            return;
        }

        const selection = new Selection({
            eventTypes: ["leftMouseDown"],
            multipleSelectionModifiers: ["shift", "ctrl", "meta"],
            filter: (cell) => {
                if (!cell?.isEdge?.()) {
                    return true;
                }

                return !selectedCells().some((selectedCell) => selectedCell?.isNode?.());
            },
            pointerEvents: "none",
            rubberNode: true,
            rubberEdge: true,
            rubberband: true,
            multiple: true,
            showNodeSelectionBox: true,
            showEdgeSelectionBox: false,
            movingRouterFallback: "orth",
        });

        graph.use(selection);
        installedGraph = graph;
        instance.addDisposer(() => {
            installedGraph = undefined;
            selection.clean?.();
            selection.dispose?.();
        });
    };

    return {
        install,
        clearSelection,
        selectedCells,
        selectedNodes,
        selectedEdges,
        hasSelection,
    };
};

export const createGraphRendererSelectionService = (
    instance: GraphRendererInstanceService,
): GraphRendererSelectionService => {
    return createGraphRendererSelectionApi(instance);
};
