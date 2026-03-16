import type { Workspace, WorkspaceTabCloseConditions } from "@engine-model/workspace";
import type { WorkspaceQueryTab } from "../components/workspace/services/query";
import type { WorkspaceCreateTabUseCaseInput } from "../components/workspace/use-cases/createTab";
import { EngineQueryApi } from "./engine/query/createUIEngineQuery";
import { EngineUseCases } from "./engine/use-cases/types";
import { EngineMountApi } from "./engine/mount/buildEngineMount";

export type EngineTabCreateInput = WorkspaceCreateTabUseCaseInput;
export type EngineTabCloseConditions = WorkspaceTabCloseConditions;
export type EngineTab = WorkspaceQueryTab;
export type EngineScope = Workspace;

export type EnginePublicApi = {
    mount: EngineMountApi;
    query: EngineQueryApi;
    api: EngineUseCases["public"];
};
