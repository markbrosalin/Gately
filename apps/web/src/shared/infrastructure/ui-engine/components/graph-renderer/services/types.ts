import type { ComponentServiceContext } from "engine-model";
import type { GraphRendererBuilderService } from "./builder/types";
import type { GraphRendererDocumentService } from "./document/types";
import type { GraphRendererNodesService } from "./nodes/types";
import type { GraphRendererQueryService } from "./query/types";
import type { GraphRendererInstanceService } from "./instance/types";
import type { GraphRendererExternal } from "../types";

export type GraphRendererServiceName = "instance" | "document" | "builder" | "nodes" | "query";

export type GraphRendererServices = {
    instance: GraphRendererInstanceService;
    document: GraphRendererDocumentService;
    builder: GraphRendererBuilderService;
    nodes: GraphRendererNodesService;
    query: GraphRendererQueryService;
};

export type GraphRendererServiceContext = ComponentServiceContext<
    GraphRendererExternal,
    GraphRendererServiceName,
    GraphRendererServices
>;
