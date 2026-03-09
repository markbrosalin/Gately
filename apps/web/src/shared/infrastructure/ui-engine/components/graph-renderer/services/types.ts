import type { ComponentServiceContext } from "@gately/shared/infrastructure/ui-engine/model";
import type { GraphRendererDocumentService } from "./document/types";
import type { GraphRendererQueryService } from "./query/types";
import type { GraphRendererInstanceService } from "./instance/types";
import type { GraphRendererExternal } from "../types";

export type GraphRendererServiceName = "instance" | "document" | "query";

export type GraphRendererServices = {
    instance: GraphRendererInstanceService;
    document: GraphRendererDocumentService;
    query: GraphRendererQueryService;
};

export type GraphRendererServiceContext = ComponentServiceContext<
    GraphRendererExternal,
    GraphRendererServiceName,
    GraphRendererServices
>;
