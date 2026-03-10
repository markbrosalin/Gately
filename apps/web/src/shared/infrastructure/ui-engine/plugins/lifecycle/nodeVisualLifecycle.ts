import type { Node } from "@antv/x6";
import type { UIEnginePlugin } from "../../model";

type NodeEventArgs = { node: Node };

export const nodeVisualLifecyclePlugin: UIEnginePlugin = {
    name: "lifecycle:nodeVisualLifecyclePlugin",
    apply(graph, ctx) {
        const visual = ctx.getService("node-visual");

        const onNodeAdded = ({ node }: NodeEventArgs) => {
            visual.mountNode(node);
        };

        const onNodeRemoved = ({ node }: NodeEventArgs) => {
            visual.unmountNode(node);
        };

        graph.on("node:added", onNodeAdded);
        graph.on("node:removed", onNodeRemoved);

        graph.getNodes().forEach((node) => {
            visual.mountNode(node);
        });

        return () => {
            graph.off("node:added", onNodeAdded);
            graph.off("node:removed", onNodeRemoved);
        };
    },
};

