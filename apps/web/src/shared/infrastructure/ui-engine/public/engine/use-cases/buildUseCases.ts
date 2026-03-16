import { createActivateWorkspaceScene } from "./helpers/activateWorkspaceScene";
import { createPersistActiveGraphDocument } from "./helpers/persistActiveGraphDocument";
import { createCloseTabUseCase } from "./closeTab";
import { createCreateNodeFromCatalogItemUseCase } from "./createNodeFromCatalogItem";
import { createCreateTabUseCase } from "./createTab";
import { createOpenWorkspaceUseCase } from "./openWorkspace";
import { createSaveActiveDocumentUseCase } from "./saveActiveDocument";
import type {
    EngineUseCasesPublic,
    EngineUseCaseInternals,
    UseCasesFactoryDeps,
    EngineUseCases,
} from "./types";

export const buildEngineUseCases = (deps: UseCasesFactoryDeps): EngineUseCases => {
    const persistActiveGraphDocument = createPersistActiveGraphDocument(deps);
    const activateWorkspaceScene = createActivateWorkspaceScene(deps);

    const internal: EngineUseCaseInternals = {
        persistActiveGraphDocument,
        activateWorkspaceScene,
    };

    const ctx = { ...deps, ...internal };

    const useCases: EngineUseCasesPublic = {
        createTab: createCreateTabUseCase(ctx),
        openWorkspace: createOpenWorkspaceUseCase(ctx),
        closeTab: createCloseTabUseCase(ctx),
        createNodeFromCatalogItem: createCreateNodeFromCatalogItemUseCase(ctx),
        saveActiveDocument: createSaveActiveDocumentUseCase(ctx),
    };

    return {
        public: useCases,
        internal,
    };
};
