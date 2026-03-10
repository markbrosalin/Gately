import { createEnsureDocumentUseCase } from "./ensureDocument";
import { createExportDocumentUseCase } from "./exportDocument";
import { createImportDocumentUseCase } from "./importDocument";
import { createRemoveDocumentUseCase } from "./removeDocument";
import { createSaveDocumentUseCase } from "./saveDocument";
import type { GraphDocumentUseCaseDeps, GraphDocumentUseCases } from "./types";

export const buildGraphDocumentUseCases = (
    deps: GraphDocumentUseCaseDeps,
): GraphDocumentUseCases => {
    return {
        ensureDocument: createEnsureDocumentUseCase(deps),
        saveDocument: createSaveDocumentUseCase(deps),
        removeDocument: createRemoveDocumentUseCase(deps),
        importDocument: createImportDocumentUseCase(deps),
        exportDocument: createExportDocumentUseCase(deps),
    };
};

