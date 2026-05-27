import type { Result } from "@engine-model/core/result";
import type { AsyncUseCase } from "@engine-model/core/use-case";
import type { WorkspaceCreateTabUseCaseInput } from "@engine-components/workspace/use-cases/createTab";
import type { UseCaseDeps, EngineUseCaseInternals } from "../types";

export type EngineCreateTabUseCaseInput = WorkspaceCreateTabUseCaseInput;
export type EngineCreateTabUseCaseResult = Result<{ tabId: string }>;
export type EngineCreateTabUseCase = AsyncUseCase<
    EngineCreateTabUseCaseInput,
    EngineCreateTabUseCaseResult
>;

export type CreateTabUseCaseDeps = Pick<UseCaseDeps, "graphDocument" | "workspace"> &
    Pick<EngineUseCaseInternals, "persistActiveGraphDocument">;
