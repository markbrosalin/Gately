import type { GraphRendererServices } from "../services";
import type { GraphRendererCloseUseCase } from "./close";
import type { GraphRendererCreateNodeUseCase } from "./createNode";
import type { GraphRendererExportDocumentUseCase } from "./exportDocument";
import type { GraphRendererLoadDocumentUseCase } from "./loadDocument";
import type { GraphRendererOpenUseCase } from "./open";
import type { GraphRendererRemoveEdgeUseCase } from "./removeEdge";
import type { GraphRendererRemoveNodeUseCase } from "./removeNode";
import type { GraphRendererRemoveSelectionUseCase } from "./removeSelection";

export type GraphRendererUseCaseDeps = GraphRendererServices;

export type GraphRendererUseCases = {
    open: GraphRendererOpenUseCase;
    close: GraphRendererCloseUseCase;
    createNode: GraphRendererCreateNodeUseCase;
    removeSelection: GraphRendererRemoveSelectionUseCase;
    removeNode: GraphRendererRemoveNodeUseCase;
    removeEdge: GraphRendererRemoveEdgeUseCase;
    loadDocument: GraphRendererLoadDocumentUseCase;
    exportDocument: GraphRendererExportDocumentUseCase;
};

