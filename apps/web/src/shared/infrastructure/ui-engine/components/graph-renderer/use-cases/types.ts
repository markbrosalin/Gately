import type { GraphRendererServices } from "../services";
import type { GraphRendererCloseUseCase } from "./close";
import type { GraphRendererCreateNodeUseCase } from "./createNode";
import type { GraphRendererExportDocumentUseCase } from "./exportDocument";
import type { GraphRendererLoadDocumentUseCase } from "./loadDocument";
import type { GraphRendererOpenUseCase } from "./open";

export type GraphRendererUseCaseDeps = GraphRendererServices;

export type GraphRendererUseCases = {
    open: GraphRendererOpenUseCase;
    close: GraphRendererCloseUseCase;
    createNode: GraphRendererCreateNodeUseCase;
    loadDocument: GraphRendererLoadDocumentUseCase;
    exportDocument: GraphRendererExportDocumentUseCase;
};

