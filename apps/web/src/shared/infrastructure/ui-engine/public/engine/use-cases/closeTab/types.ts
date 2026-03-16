import type { Result } from "@engine-model/core/result";
import type { UseCase } from "@engine-model/core/use-case";
import type { WorkspaceTabCloseConditions, WorkspaceTabSession } from "@engine-model/workspace";
import type { UseCaseDeps, EngineUseCaseInternals } from "../types";

export type EngineCloseTabUseCaseInput = {
    tabId: string;
    conditions?: WorkspaceTabCloseConditions;
};

export type EngineCloseTabUseCaseResult = Result<WorkspaceTabSession>;
export type EngineCloseTabUseCase = UseCase<
    EngineCloseTabUseCaseInput,
    EngineCloseTabUseCaseResult
>;

export type CloseTabUseCaseDeps = Pick<UseCaseDeps, "graphRenderer" | "workspace"> &
    Pick<EngineUseCaseInternals, "activateWorkspaceScene" | "persistActiveGraphDocument">;
