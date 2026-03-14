import type { ComponentServiceContext } from "@engine-model/core/context";
import type { GraphRendererBuilderService } from "./builder/types";
import type { GraphRendererConnectingService } from "./connecting";
import type { GraphRendererDocumentService } from "./document/types";
import type { GraphRendererNodesService } from "./nodes/types";
import type { GraphRendererQueryService } from "./query/types";
import type { GraphRendererRemovalService } from "./removal";
import type { GraphRendererSelectionService } from "./selection";
import type { GraphRendererInstanceService } from "./instance/types";
import type { GraphRendererLayoutsService } from "./layouts/types";
import type { GraphRendererExternal } from "../types";

export type GraphRendererServiceName =
    | "connecting"
    | "instance"
    | "document"
    | "builder"
    | "nodes"
    | "selection"
    | "removal"
    | "query"
    | "layouts";

export type GraphRendererServices = {
    connecting: GraphRendererConnectingService;
    instance: GraphRendererInstanceService;
    document: GraphRendererDocumentService;
    builder: GraphRendererBuilderService;
    nodes: GraphRendererNodesService;
    selection: GraphRendererSelectionService;
    removal: GraphRendererRemovalService;
    query: GraphRendererQueryService;
    layouts: GraphRendererLayoutsService;
};

export type GraphRendererServiceContext = ComponentServiceContext<
    GraphRendererExternal,
    GraphRendererServiceName,
    GraphRendererServices
>;


