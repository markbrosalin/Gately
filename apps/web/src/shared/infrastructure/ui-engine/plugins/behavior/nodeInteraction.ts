/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UIEnginePlugin } from "../../model";

export const nodeInteractionPlugin: UIEnginePlugin = {
    name: "behavior:nodeInteraction",
    apply(graph, _ctx) {
        const onNodeMouseDown = ({ cell }: any) => {
            cell?.toFront?.();
        };
        const onNodeSelected = ({ cell }: any) => {
            cell?.toFront?.();
        };

        graph.on("node:mousedown", onNodeMouseDown);
        graph.on("node:selected", onNodeSelected);

        return () => {
            graph.off("node:mousedown", onNodeMouseDown);
            graph.off("node:selected", onNodeSelected);
        };
    },
};

