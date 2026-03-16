import type { ComponentDeps } from "@engine-model/core/context";
import type { GraphRendererQueryService } from "./services/query";
import type { GraphRendererClearSceneUseCase } from "./use-cases/clearScene";
import type { GraphRendererCreateNodeUseCase } from "./use-cases/createNode";
import type { GraphRendererExportDocumentUseCase } from "./use-cases/exportDocument";
import type { GraphRendererLoadDocumentUseCase } from "./use-cases/loadDocument";
import type { GraphRendererMountUseCase } from "./use-cases/mount";
import type { GraphRendererRemoveEdgeUseCase } from "./use-cases/removeEdge";
import type { GraphRendererRemoveNodeUseCase } from "./use-cases/removeNode";
import type { GraphRendererRemoveSelectionUseCase } from "./use-cases/removeSelection";
import type { GraphRendererInstanceLifecycleApi } from "./services/instance";
import type { GraphRendererUnmountUseCase } from "./use-cases/unmount";

export type GraphRendererExternal = {};

export type GraphRendererDeps = ComponentDeps<GraphRendererExternal>;

export type GraphRendererApi = {
    query: GraphRendererQueryService;
    lifecycle: GraphRendererInstanceLifecycleApi;
    mount: GraphRendererMountUseCase;
    unmount: GraphRendererUnmountUseCase;
    clearScene: GraphRendererClearSceneUseCase;
    createNode: GraphRendererCreateNodeUseCase;
    removeSelection: GraphRendererRemoveSelectionUseCase;
    removeNode: GraphRendererRemoveNodeUseCase;
    removeEdge: GraphRendererRemoveEdgeUseCase;
    loadDocument: GraphRendererLoadDocumentUseCase;
    exportDocument: GraphRendererExportDocumentUseCase;
};


