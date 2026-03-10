import type { GraphDocumentServices } from "../services";
import type { GraphDocumentEnsureDocumentUseCase } from "./ensureDocument";
import type { GraphDocumentExportDocumentUseCase } from "./exportDocument";
import type { GraphDocumentImportDocumentUseCase } from "./importDocument";
import type { GraphDocumentRemoveDocumentUseCase } from "./removeDocument";
import type { GraphDocumentSaveDocumentUseCase } from "./saveDocument";

export type GraphDocumentUseCaseDeps = GraphDocumentServices;

export type GraphDocumentUseCases = {
    ensureDocument: GraphDocumentEnsureDocumentUseCase;
    saveDocument: GraphDocumentSaveDocumentUseCase;
    removeDocument: GraphDocumentRemoveDocumentUseCase;
    importDocument: GraphDocumentImportDocumentUseCase;
    exportDocument: GraphDocumentExportDocumentUseCase;
};

