import { createCloseUseCase } from "./close";
import { createExportDocumentUseCase } from "./exportDocument";
import { createLoadDocumentUseCase } from "./loadDocument";
import { createOpenUseCase } from "./open";
import type { GraphRendererUseCaseDeps, GraphRendererUseCases } from "./types";

export const buildGraphRendererUseCases = (
    deps: GraphRendererUseCaseDeps,
): GraphRendererUseCases => {
    return {
        open: createOpenUseCase(deps),
        close: createCloseUseCase(deps),
        loadDocument: createLoadDocumentUseCase(deps),
        exportDocument: createExportDocumentUseCase(deps),
    };
};
