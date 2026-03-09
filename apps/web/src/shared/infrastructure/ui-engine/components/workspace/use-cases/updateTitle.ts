import { createErrResult, createOkResult, type Result, type UseCase, type Workspace } from "engine-model";
import { workspaceUseCaseIssues } from "./issues";
import type { WorkspaceUseCaseDeps } from "./types";

type WorkspaceUpdateTitleInput = {
    workspaceId: string;
    title: string;
};

type WorkspaceUpdateTitleResult = Result<Workspace>;

export type WorkspaceUpdateTitleUseCase = UseCase<
    WorkspaceUpdateTitleInput,
    WorkspaceUpdateTitleResult
>;

export const createUpdateTitleUseCase = ({
    query,
    state,
}: Pick<WorkspaceUseCaseDeps, "query" | "state">): WorkspaceUpdateTitleUseCase => {
    return ({ workspaceId, title }) => {
        const trimmedTitle = title.trim();
        if (trimmedTitle.length === 0) {
            return createErrResult(workspaceUseCaseIssues.workspaceTitleRequired(["title"]));
        }

        const workspace = query.getWorkspace(workspaceId);
        if (!workspace) {
            return createErrResult(
                workspaceUseCaseIssues.workspaceNotFound(["workspaceId"], workspaceId),
            );
        }

        state.setWorkspaceTitle(workspaceId, trimmedTitle);

        return createOkResult(
            query.getWorkspace(workspaceId) ?? {
                ...workspace,
                title: trimmedTitle,
            },
        );
    };
};
