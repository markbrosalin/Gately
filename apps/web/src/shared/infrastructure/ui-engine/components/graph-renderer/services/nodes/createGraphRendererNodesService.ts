import type { Node } from "@antv/x6";
import type { UIEngineNodeData, UIEngineNodeProps } from "@engine-model";
import type { GraphRendererInstanceService } from "../instance";
import type { GraphRendererNodesService } from "./types";

export const createGraphRendererNodesApi = (
    instance: GraphRendererInstanceService,
): GraphRendererNodesService => {
    const getRequiredGraph = () => {
        const graph = instance.graph();
        if (!graph) {
            throw new Error("Graph renderer is not open.");
        }

        return graph;
    };

    const createNode = (props: UIEngineNodeProps): Node => {
        return getRequiredGraph().addNode(props);
    };

    const getNode = (nodeId: string): Node | undefined => {
        const graph = instance.graph();
        if (!graph) {
            return undefined;
        }

        const cell = graph.getCellById(nodeId);
        if (!cell || !cell.isNode?.()) {
            return undefined;
        }

        return cell as Node;
    };

    const removeNode = (nodeId: string): void => {
        getRequiredGraph().removeNode(nodeId);
    };

    const updateNodeData = (nodeId: string, patch: Partial<UIEngineNodeData>): void => {
        const node = getNode(nodeId);
        if (!node) {
            return;
        }

        const data = (node.getData() ?? {}) as UIEngineNodeData;
        node.setData({
            ...data,
            ...patch,
        });
    };

    return {
        createNode,
        getNode,
        removeNode,
        updateNodeData,
    };
};

export const createGraphRendererNodesService = (
    instance: GraphRendererInstanceService,
): GraphRendererNodesService => {
    return createGraphRendererNodesApi(instance);
};


