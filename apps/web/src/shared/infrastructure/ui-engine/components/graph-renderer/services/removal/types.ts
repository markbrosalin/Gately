export type GraphRendererRemovalService = {
    removeSelection: () => void;
    removeNode: (nodeId: string) => boolean;
    removeEdge: (edgeId: string) => boolean;
};
