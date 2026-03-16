import type { GraphRendererServices } from "../services";
import type { GraphRendererClearSceneUseCase } from "./clearScene";
import type { GraphRendererCreateNodeUseCase } from "./createNode";
import type { GraphRendererExportDocumentUseCase } from "./exportDocument";
import type { GraphRendererLoadDocumentUseCase } from "./loadDocument";
import type { GraphRendererMountUseCase } from "./mount";
import type { GraphRendererRemoveEdgeUseCase } from "./removeEdge";
import type { GraphRendererRemoveNodeUseCase } from "./removeNode";
import type { GraphRendererRemoveSelectionUseCase } from "./removeSelection";
import type { GraphRendererUnmountUseCase } from "./unmount";

export type GraphRendererUseCaseDeps = GraphRendererServices;

export type GraphRendererUseCases = {
    mount: GraphRendererMountUseCase;
    unmount: GraphRendererUnmountUseCase;
    clearScene: GraphRendererClearSceneUseCase;
    createNode: GraphRendererCreateNodeUseCase;
    removeSelection: GraphRendererRemoveSelectionUseCase;
    removeNode: GraphRendererRemoveNodeUseCase;
    removeEdge: GraphRendererRemoveEdgeUseCase;
    loadDocument: GraphRendererLoadDocumentUseCase;
    exportDocument: GraphRendererExportDocumentUseCase;
};

