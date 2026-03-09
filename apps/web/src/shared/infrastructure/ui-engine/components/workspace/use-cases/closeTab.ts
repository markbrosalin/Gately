import type {
    WorkspaceTabCloseConditions,
    WorkspaceTabSession,
} from "@gately/shared/infrastructure/ui-engine/model";
import type { UseCase, Result } from "../../../model";
import { createErrResult, createOkResult } from "../../../model";
import { workspaceUseCaseIssues } from "./issues";
import type { WorkspaceUseCaseDeps } from "./types";

type WorkspaceCloseTabInput = {
    tabId: string;
    conditions?: WorkspaceTabCloseConditions;
};

type WorkspaceCloseTabResult = Result<WorkspaceTabSession>;

export type WorkspaceCloseTabUseCase = UseCase<WorkspaceCloseTabInput, WorkspaceCloseTabResult>;

export const createCloseTabUseCase = ({
    query,
    state,
}: Pick<WorkspaceUseCaseDeps, "query" | "state">): WorkspaceCloseTabUseCase => {
    return ({ tabId, conditions }) => {
        if (query.orderedTabs().length <= 1 || conditions?.isEditing) {
            return createErrResult(workspaceUseCaseIssues.tabCloseForbidden(["tabId"], tabId));
        }

        const nextActiveTabId = query.getNextActiveTabIdAfterClose(tabId);

        const removedSession = state.removeTabSession(tabId);
        if (!removedSession) {
            return createErrResult(workspaceUseCaseIssues.tabSessionNotFound(["tabId"], tabId));
        }

        if (nextActiveTabId) {
            const nextSession = query.getTabSession(nextActiveTabId);
            state.setActiveTab(nextActiveTabId);
            state.setActiveWorkspace(nextSession?.activeWorkspaceId ?? nextActiveTabId);
        }

        return createOkResult(removedSession);
    };
};
