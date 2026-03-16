import type { GraphDocument } from "@engine-model/graph-document";
import type { Result } from "@engine-model/core/result";
import { EngineComponents } from "../components/createComponents";
import { EngineCreateTabUseCase } from "./createTab";
import { EngineCloseTabUseCase } from "./closeTab";
import { EngineCreateNodeFromCatalogItemUseCase } from "./createNodeFromCatalogItem";
import { EngineOpenWorkspaceUseCase } from "./openWorkspace";
import { EngineSaveActiveDocumentUseCase } from "./saveActiveDocument";

export type UseCaseDeps = EngineComponents;
export type UseCasesFactoryDeps = EngineComponents;

export type PersistActiveGraphDocumentResult = Result<GraphDocument | undefined>;
export type ActivateWorkspaceSceneResult = Result<GraphDocument>;

export type EngineUseCaseInternals = {
    persistActiveGraphDocument: () => PersistActiveGraphDocumentResult;
    activateWorkspaceScene: (workspaceId: string) => ActivateWorkspaceSceneResult;
};

export type EngineUseCases = {
    public: EngineUseCasesPublic;
    internal: EngineUseCaseInternals;
};

export type EngineUseCasesPublic = {
    createTab: EngineCreateTabUseCase;
    openWorkspace: EngineOpenWorkspaceUseCase;
    closeTab: EngineCloseTabUseCase;
    createNodeFromCatalogItem: EngineCreateNodeFromCatalogItemUseCase;
    saveActiveDocument: EngineSaveActiveDocumentUseCase;
};
