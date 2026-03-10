import type { ComponentDeps } from "@engine-model/core/context";
import type { GraphRendererQueryService } from "./services/query";
import type { GraphRendererCloseUseCase } from "./use-cases/close";
import type { GraphRendererCreateNodeUseCase } from "./use-cases/createNode";
import type { GraphRendererExportDocumentUseCase } from "./use-cases/exportDocument";
import type { GraphRendererLoadDocumentUseCase } from "./use-cases/loadDocument";
import type { GraphRendererOpenUseCase } from "./use-cases/open";

export type GraphRendererExternal = {};

export type GraphRendererDeps = ComponentDeps<GraphRendererExternal>;

export type GraphRendererApi = {
    query: GraphRendererQueryService;
    open: GraphRendererOpenUseCase;
    close: GraphRendererCloseUseCase;
    createNode: GraphRendererCreateNodeUseCase;
    loadDocument: GraphRendererLoadDocumentUseCase;
    exportDocument: GraphRendererExportDocumentUseCase;
};


