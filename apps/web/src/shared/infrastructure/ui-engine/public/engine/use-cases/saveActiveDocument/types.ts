import type { GraphDocument } from "@engine-model/graph-document";
import type { Result } from "@engine-model/core/result";
import type { UseCase } from "@engine-model/core/use-case";
import type { UseCaseDeps, EngineUseCaseInternals } from "../types";

export type EngineSaveActiveDocumentUseCaseResult = Result<GraphDocument>;
export type EngineSaveActiveDocumentUseCase = UseCase<void, EngineSaveActiveDocumentUseCaseResult>;

export type SaveActiveDocumentUseCaseDeps = Pick<UseCaseDeps, "graphRenderer" | "workspace"> &
    Pick<EngineUseCaseInternals, "persistActiveGraphDocument">;
