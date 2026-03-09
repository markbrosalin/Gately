import type { UseCase, Result } from "../../../model";
import { createErrResult, createOkResult } from "../../../model";
import type { Workspace } from "@gately/shared/infrastructure/ui-engine/model";
import { workspaceUseCaseIssues } from "./issues";
import type { WorkspaceUseCaseDeps } from "./types";

type WorkspaceOpenInput = {
    workspaceId: string;
};

type WorkspaceOpenResult = Result<Workspace>;

export type WorkspaceOpenUseCase = UseCase<WorkspaceOpenInput, WorkspaceOpenResult>;

export const createOpenUseCase = ({
    query,
    state,
}: Pick<WorkspaceUseCaseDeps, "query" | "state">): WorkspaceOpenUseCase => {
    return ({ workspaceId }) => {
        const workspace = query.getWorkspace(workspaceId);
        if (!workspace) {
            return createErrResult(
                workspaceUseCaseIssues.workspaceNotFound(["workspaceId"], workspaceId),
            );
        }

        const rootWorkspaceId = query.getWorkspaceRootId(workspaceId);
        if (!rootWorkspaceId) {
            return createErrResult(
                workspaceUseCaseIssues.workspaceNotFound(["workspaceId"], workspaceId),
            );
        }

        const session = query.getTabSession(rootWorkspaceId);
        if (!session) {
            return createErrResult(
                workspaceUseCaseIssues.tabSessionNotFound(["workspaceId"], rootWorkspaceId),
            );
        }

        const navigationPath = query.getWorkspaceOpenPath(workspaceId);

        state.setActiveTab(rootWorkspaceId);
        state.setNavigationPath(rootWorkspaceId, navigationPath);
        state.setActiveWorkspace(workspace.id);

        return createOkResult(workspace);
    };
};
