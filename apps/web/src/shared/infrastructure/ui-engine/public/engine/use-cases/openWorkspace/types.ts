import type { Result } from "@engine-model/core/result";
import type { UseCase } from "@engine-model/core/use-case";
import type { Workspace } from "@engine-model/workspace";
import type { UIEngineUseCaseDeps, UIEngineUseCaseInternals } from "../types";

export type UIEngineOpenWorkspaceUseCaseInput = {
    workspaceId: string;
};

export type UIEngineOpenWorkspaceUseCaseResult = Result<Workspace>;
export type UIEngineOpenWorkspaceUseCase = UseCase<
    UIEngineOpenWorkspaceUseCaseInput,
    UIEngineOpenWorkspaceUseCaseResult
>;

export type OpenWorkspaceUseCaseDeps = Pick<UIEngineUseCaseDeps, "workspace"> &
    Pick<UIEngineUseCaseInternals, "activateWorkspaceScene" | "persistActiveGraphDocument">;
