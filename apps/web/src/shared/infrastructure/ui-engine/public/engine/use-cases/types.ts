import type { GraphDocument } from "@engine-model/graph-document";
import type { Result } from "@engine-model/core/result";
import type { CatalogApi } from "../../../components/catalog/types";
import type { GraphDocumentApi } from "../../../components/graph-document/types";
import type { GraphRendererApi } from "../../../components/graph-renderer/types";
import type { WorkspaceApi } from "../../../components/workspace/types";

export type UIEngineUseCaseDeps = {
    catalog: CatalogApi;
    workspace: WorkspaceApi;
    graphDocument: GraphDocumentApi;
    graphRenderer: GraphRendererApi;
};

export type UIEngineUseCasesFactoryDeps = UIEngineUseCaseDeps;

export type PersistActiveGraphDocumentResult = Result<GraphDocument | undefined>;
export type ActivateWorkspaceSceneResult = Result<GraphDocument>;

export type UIEngineUseCaseInternals = {
    persistActiveGraphDocument: () => PersistActiveGraphDocumentResult;
    activateWorkspaceScene: (workspaceId: string) => ActivateWorkspaceSceneResult;
};
