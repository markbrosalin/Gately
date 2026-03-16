import { createClearSceneUseCase } from "./clearScene";
import { createCreateNodeUseCase } from "./createNode";
import { createExportDocumentUseCase } from "./exportDocument";
import { createLoadDocumentUseCase } from "./loadDocument";
import { createMountUseCase } from "./mount";
import { createRemoveEdgeUseCase } from "./removeEdge";
import { createRemoveNodeUseCase } from "./removeNode";
import { createRemoveSelectionUseCase } from "./removeSelection";
import { createUnmountUseCase } from "./unmount";
import type { GraphRendererUseCaseDeps, GraphRendererUseCases } from "./types";

export const buildGraphRendererUseCases = (
    deps: GraphRendererUseCaseDeps,
): GraphRendererUseCases => {
    return {
        mount: createMountUseCase(deps),
        unmount: createUnmountUseCase(deps),
        clearScene: createClearSceneUseCase(deps),
        createNode: createCreateNodeUseCase(deps),
        removeSelection: createRemoveSelectionUseCase(deps),
        removeNode: createRemoveNodeUseCase(deps),
        removeEdge: createRemoveEdgeUseCase(deps),
        loadDocument: createLoadDocumentUseCase(deps),
        exportDocument: createExportDocumentUseCase(deps),
    };
};

