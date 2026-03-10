import { Selection } from "@antv/x6";
import type { UIEnginePlugin } from "../../model";

export const selectionPlugin: UIEnginePlugin = {
    name: "tools:selection",
    apply(graph, _ctx) {
        const selection = new Selection({
            eventTypes: ["leftMouseDown"],
            multipleSelectionModifiers: ["shift", "ctrl", "meta"],
            filter: (cell) => {
                if (!cell?.isEdge?.()) return true;
                const selected = graph.getSelectedCells?.() ?? [];
                return !selected.some((c) => c?.isNode?.());
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

        return () => {
            selection.clean?.();
            selection.dispose?.();
        };
    },
};

