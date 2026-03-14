import { createErrResult, createOkResult } from "@engine-model/core/result";
import type { CloseTabUseCaseDeps, UIEngineCloseTabUseCase } from "./types";

export const createCloseTabUseCase = ({
    graphRenderer,
    workspace,
    activateWorkspaceScene,
    persistActiveGraphDocument,
    syncRendererReady,
}: CloseTabUseCaseDeps): UIEngineCloseTabUseCase => {
    return ({ tabId, conditions }) => {
        const isClosingActiveTab = workspace.query.activeTabId() === tabId;
        if (isClosingActiveTab) {
            const persistResult = persistActiveGraphDocument();
            if (!persistResult.ok) {
                return createErrResult(persistResult.issues);
            }
        }

        const closeResult = workspace.closeTab({ tabId, conditions });
        if (!closeResult.ok || !closeResult.value) {
            return createErrResult(closeResult.issues);
        }

        const nextActiveWorkspaceId = workspace.query.activeWorkspaceId();
        if (nextActiveWorkspaceId) {
            const activateResult = activateWorkspaceScene(nextActiveWorkspaceId);
            if (!activateResult.ok) {
                return createErrResult(activateResult.issues);
            }
        } else if (graphRenderer.query.isOpen()) {
            const closeRendererResult = graphRenderer.close();
            if (!closeRendererResult.ok) {
                return createErrResult(closeRendererResult.issues);
            }

            syncRendererReady();
        }

        return createOkResult(closeResult.value);
    };
};
