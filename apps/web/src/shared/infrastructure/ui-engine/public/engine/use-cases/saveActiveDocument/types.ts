import type { GraphDocument } from "@engine-model/graph-document";
import type { Result } from "@engine-model/core/result";
import type { UseCase } from "@engine-model/core/use-case";
import type { UIEngineUseCaseDeps, UIEngineUseCaseInternals } from "../types";

export type UIEngineSaveActiveDocumentUseCaseResult = Result<GraphDocument>;
export type UIEngineSaveActiveDocumentUseCase = UseCase<void, UIEngineSaveActiveDocumentUseCaseResult>;

export type SaveActiveDocumentUseCaseDeps = Pick<
    UIEngineUseCaseDeps,
    "graphRenderer" | "workspace"
> &
    Pick<UIEngineUseCaseInternals, "persistActiveGraphDocument">;
