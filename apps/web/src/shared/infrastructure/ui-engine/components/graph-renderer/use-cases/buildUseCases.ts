import { createCloseUseCase } from "./close";
import { createCreateNodeUseCase } from "./createNode";
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
        createNode: createCreateNodeUseCase(deps),
        loadDocument: createLoadDocumentUseCase(deps),
        exportDocument: createExportDocumentUseCase(deps),
    };
};
