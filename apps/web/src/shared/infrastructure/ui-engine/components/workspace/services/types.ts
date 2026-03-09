import type { WorkspaceFactoryService } from "./factory/types";
import type { WorkspaceQueryService } from "./query/types";
import type { WorkspaceStateService } from "./state/types";
import type { WorkspaceExternal } from "../external";
import { ComponentServiceContext } from "engine-model";

export type WorkspaceServiceName = "factory" | "state" | "query";

export type WorkspaceServices = {
    factory: WorkspaceFactoryService;
    state: WorkspaceStateService;
    query: WorkspaceQueryService;
};

export type WorkspaceServiceContext = ComponentServiceContext<
    WorkspaceExternal,
    WorkspaceServiceName,
    WorkspaceServices
>;
