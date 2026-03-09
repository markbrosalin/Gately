import type { GraphRendererServices } from "../services";
import type { GraphRendererCloseUseCase } from "./close";
import type { GraphRendererExportDocumentUseCase } from "./exportDocument";
import type { GraphRendererLoadDocumentUseCase } from "./loadDocument";
import type { GraphRendererOpenUseCase } from "./open";

export type GraphRendererUseCaseDeps = GraphRendererServices;

export type GraphRendererUseCases = {
    open: GraphRendererOpenUseCase;
    close: GraphRendererCloseUseCase;
    loadDocument: GraphRendererLoadDocumentUseCase;
    exportDocument: GraphRendererExportDocumentUseCase;
};
