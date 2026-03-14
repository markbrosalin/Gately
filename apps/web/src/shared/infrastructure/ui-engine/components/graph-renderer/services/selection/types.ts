import type { Cell, Edge, Node } from "@antv/x6";

export type GraphRendererSelectionService = {
    install: () => void;
    clearSelection: () => void;
    selectedCells: () => Cell[];
    selectedNodes: () => Node[];
    selectedEdges: () => Edge[];
    hasSelection: () => boolean;
};
