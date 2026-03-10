import type { ComponentServiceContext } from "@engine-model";
import type { GraphDocumentFactoryService } from "./factory/types";
import type { GraphDocumentQueryService } from "./query/types";
import type { GraphDocumentStateService } from "./state/types";
import type { GraphDocumentExternal } from "../types";

export type GraphDocumentServiceName = "factory" | "state" | "query";

export type GraphDocumentServices = {
    factory: GraphDocumentFactoryService;
    state: GraphDocumentStateService;
    query: GraphDocumentQueryService;
};

export type GraphDocumentServiceContext = ComponentServiceContext<
    GraphDocumentExternal,
    GraphDocumentServiceName,
    GraphDocumentServices
>;


