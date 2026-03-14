import { createActivateWorkspaceScene } from "./helpers/activateWorkspaceScene";
import { createPersistActiveGraphDocument } from "./helpers/persistActiveGraphDocument";
import {
    createCloseTabUseCase,
    type UIEngineCloseTabUseCase,
} from "./closeTab";
import {
    createCreateNodeFromCatalogItemUseCase,
    type UIEngineCreateNodeFromCatalogItemUseCase,
} from "./createNodeFromCatalogItem";
import {
    createCreateTabUseCase,
    type UIEngineCreateTabUseCase,
} from "./createTab";
import {
    createOpenWorkspaceUseCase,
    type UIEngineOpenWorkspaceUseCase,
} from "./openWorkspace";
import {
    createSaveActiveDocumentUseCase,
    type UIEngineSaveActiveDocumentUseCase,
} from "./saveActiveDocument";
import type { UIEngineUseCaseInternals, UIEngineUseCasesFactoryDeps } from "./types";

export type UIEngineUseCases = {
    createTab: UIEngineCreateTabUseCase;
    openWorkspace: UIEngineOpenWorkspaceUseCase;
    closeTab: UIEngineCloseTabUseCase;
    createNodeFromCatalogItem: UIEngineCreateNodeFromCatalogItemUseCase;
    saveActiveDocument: UIEngineSaveActiveDocumentUseCase;
};

export type BuildUIEngineUseCasesResult = {
    useCases: UIEngineUseCases;
    internals: UIEngineUseCaseInternals;
};

export const buildUIEngineUseCases = (
    deps: UIEngineUseCasesFactoryDeps,
): BuildUIEngineUseCasesResult => {
    const syncRendererReady = () => {
        deps.setRendererReady(deps.graphRenderer.query.isOpen());
    };
    const persistActiveGraphDocument = createPersistActiveGraphDocument(deps);
    const activateWorkspaceScene = createActivateWorkspaceScene({
        ...deps,
        syncRendererReady,
    });

    const useCases: UIEngineUseCases = {
        createTab: createCreateTabUseCase({
            ...deps,
            activateWorkspaceScene,
            persistActiveGraphDocument,
        }),
        openWorkspace: createOpenWorkspaceUseCase({
            ...deps,
            activateWorkspaceScene,
            persistActiveGraphDocument,
        }),
        closeTab: createCloseTabUseCase({
            ...deps,
            activateWorkspaceScene,
            persistActiveGraphDocument,
            syncRendererReady,
        }),
        createNodeFromCatalogItem: createCreateNodeFromCatalogItemUseCase({
            ...deps,
        }),
        saveActiveDocument: createSaveActiveDocumentUseCase({
            ...deps,
            persistActiveGraphDocument,
        }),
    };

    return {
        useCases,
        internals: {
            persistActiveGraphDocument,
            activateWorkspaceScene,
            syncRendererReady,
        },
    };
};
