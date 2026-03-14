import type { Result } from "@engine-model/core/result";
import type { UseCase } from "@engine-model/core/use-case";
import type { WorkspaceTabCloseConditions, WorkspaceTabSession } from "@engine-model/workspace";
import type { UIEngineUseCaseDeps, UIEngineUseCaseInternals } from "../types";

export type UIEngineCloseTabUseCaseInput = {
    tabId: string;
    conditions?: WorkspaceTabCloseConditions;
};

export type UIEngineCloseTabUseCaseResult = Result<WorkspaceTabSession>;
export type UIEngineCloseTabUseCase = UseCase<
    UIEngineCloseTabUseCaseInput,
    UIEngineCloseTabUseCaseResult
>;

export type CloseTabUseCaseDeps = Pick<UIEngineUseCaseDeps, "graphRenderer" | "workspace"> &
    Pick<
        UIEngineUseCaseInternals,
        "activateWorkspaceScene" | "persistActiveGraphDocument" | "syncRendererReady"
    >;
