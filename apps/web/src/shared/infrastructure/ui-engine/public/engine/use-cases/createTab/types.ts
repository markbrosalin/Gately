import type { Result } from "@engine-model/core/result";
import type { AsyncUseCase } from "@engine-model/core/use-case";
import type { WorkspaceCreateTabUseCaseInput } from "@engine-components/workspace/use-cases/createTab";
import type { UIEngineUseCaseDeps, UIEngineUseCaseInternals } from "../types";

export type UIEngineCreateTabUseCaseInput = WorkspaceCreateTabUseCaseInput;
export type UIEngineCreateTabUseCaseResult = Result<{ tabId: string }>;
export type UIEngineCreateTabUseCase = AsyncUseCase<
    UIEngineCreateTabUseCaseInput,
    UIEngineCreateTabUseCaseResult
>;

export type CreateTabUseCaseDeps = Pick<
    UIEngineUseCaseDeps,
    "getContainer" | "graphDocument" | "workspace"
> &
    Pick<UIEngineUseCaseInternals, "activateWorkspaceScene" | "persistActiveGraphDocument">;
