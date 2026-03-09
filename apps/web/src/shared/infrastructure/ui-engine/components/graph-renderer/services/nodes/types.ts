import type { Node } from "@antv/x6";
import type { UIEngineNodeData, UIEngineNodeProps } from "engine-model/types";

export type GraphRendererNodesService = {
    createNode: (props: UIEngineNodeProps) => Node;
    getNode: (nodeId: string) => Node | undefined;
    removeNode: (nodeId: string) => void;
    updateNodeData: (nodeId: string, patch: Partial<UIEngineNodeData>) => void;
};
