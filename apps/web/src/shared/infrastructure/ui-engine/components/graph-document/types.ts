import { ComponentDeps } from "@engine-model";
import type { GraphDocumentQueryService } from "./services/query";
import type { GraphDocumentEnsureDocumentUseCase } from "./use-cases/ensureDocument";
import type { GraphDocumentExportDocumentUseCase } from "./use-cases/exportDocument";
import type { GraphDocumentImportDocumentUseCase } from "./use-cases/importDocument";
import type { GraphDocumentRemoveDocumentUseCase } from "./use-cases/removeDocument";
import type { GraphDocumentSaveDocumentUseCase } from "./use-cases/saveDocument";

export type GraphDocumentExternal = {};

export type GraphDocumentDeps = ComponentDeps<GraphDocumentExternal>;

export type GraphDocumentApi = {
    query: GraphDocumentQueryService;
    ensureDocument: GraphDocumentEnsureDocumentUseCase;
    saveDocument: GraphDocumentSaveDocumentUseCase;
    removeDocument: GraphDocumentRemoveDocumentUseCase;
    importDocument: GraphDocumentImportDocumentUseCase;
    exportDocument: GraphDocumentExportDocumentUseCase;
};


