import type { Result } from "@engine-model/core/result";
import type { UseCase } from "@engine-model/core/use-case";
import type { Workspace } from "@engine-model/workspace";
import type { UseCaseDeps, EngineUseCaseInternals } from "../types";

export type EngineOpenWorkspaceUseCaseInput = {
    workspaceId: string;
};

export type EngineOpenWorkspaceUseCaseResult = Result<Workspace>;
export type EngineOpenWorkspaceUseCase = UseCase<
    EngineOpenWorkspaceUseCaseInput,
    EngineOpenWorkspaceUseCaseResult
>;

export type OpenWorkspaceUseCaseDeps = Pick<UseCaseDeps, "workspace"> &
    Pick<EngineUseCaseInternals, "activateWorkspaceScene" | "persistActiveGraphDocument">;
