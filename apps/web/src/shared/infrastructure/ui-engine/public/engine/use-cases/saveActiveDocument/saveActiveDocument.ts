import { createErrResult, createOkResult } from "@engine-model/core/result";
import { uiEngineUseCaseIssues } from "../issues";
import type { SaveActiveDocumentUseCaseDeps, UIEngineSaveActiveDocumentUseCase } from "./types";

export const createSaveActiveDocumentUseCase = ({
    graphRenderer,
    workspace,
    persistActiveGraphDocument,
}: SaveActiveDocumentUseCaseDeps): UIEngineSaveActiveDocumentUseCase => {
    return () => {
        const activeWorkspaceId = workspace.query.activeWorkspaceId();
        if (!activeWorkspaceId) {
            return createErrResult(uiEngineUseCaseIssues.activeWorkspaceNotFound([]));
        }

        if (!graphRenderer.query.isOpen()) {
            return createErrResult(uiEngineUseCaseIssues.rendererNotReady([]));
        }

        const persistResult = persistActiveGraphDocument();
        if (!persistResult.ok) {
            return createErrResult(persistResult.issues);
        }

        if (!persistResult.value) {
            return createErrResult(uiEngineUseCaseIssues.rendererNotReady([]));
        }

        return createOkResult(persistResult.value);
    };
};
