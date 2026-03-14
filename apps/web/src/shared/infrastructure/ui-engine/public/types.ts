import type { Graph } from "@antv/x6";
import type { Workspace, WorkspaceTabCloseConditions } from "@engine-model/workspace";
import type { CatalogQueryService } from "../components/catalog/services/query";
import type { GraphDocumentQueryService } from "../components/graph-document/services/query";
import type { GraphRendererQueryService } from "../components/graph-renderer/services/query";
import type { WorkspaceQueryService, WorkspaceQueryTab } from "../components/workspace/services/query";
import type { WorkspaceCreateTabUseCaseInput } from "../components/workspace/use-cases/createTab";
import type {
    UIEngineCloseTabUseCase,
    UIEngineCreateNodeFromCatalogItemUseCase,
    UIEngineCreateTabUseCase,
    UIEngineOpenWorkspaceUseCase,
    UIEngineSaveActiveDocumentUseCase,
} from "./engine/use-cases";

export type UIEngineTabCreateInput = WorkspaceCreateTabUseCaseInput;
export type UIEngineTabCloseConditions = WorkspaceTabCloseConditions;
export type UIEngineTab = WorkspaceQueryTab;
export type UIEngineScope = Workspace;

export type UIEngineMountApi = {
    setContainer: (container?: HTMLDivElement) => void;
};

export type UIEngineEngineQueryApi = {
    isMounted: () => boolean;
    isReady: () => boolean;
};

export type UIEngineQueryApi = {
    engine: UIEngineEngineQueryApi;
    catalog: CatalogQueryService;
    workspace: WorkspaceQueryService;
    graphDocument: GraphDocumentQueryService;
    graphRenderer: GraphRendererQueryService;
};

export type UIEngineUseCasesApi = {
    createTab: UIEngineCreateTabUseCase;
    openWorkspace: UIEngineOpenWorkspaceUseCase;
    closeTab: UIEngineCloseTabUseCase;
    createNodeFromCatalogItem: UIEngineCreateNodeFromCatalogItemUseCase;
    saveActiveDocument: UIEngineSaveActiveDocumentUseCase;
};

export type UIEngineDebugApi = {
    graph: () => Graph | undefined;
};

export type UIEnginePublicApi = {
    mount: UIEngineMountApi;
    query: UIEngineQueryApi;
    useCases: UIEngineUseCasesApi;
    debug: UIEngineDebugApi;
};

export type UIEngineInstance = UIEnginePublicApi & {
    dispose: () => void;
};
