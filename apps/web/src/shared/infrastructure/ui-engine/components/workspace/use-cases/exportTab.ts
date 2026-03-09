import type { Result, WorkspaceTabDocument } from "../../../model";
import { createErrResult, createOkResult } from "../../../model";
import { WORKSPACE_TAB_DOCUMENT_FORMAT_VERSION } from "../../../model/workspace/constants";
import { collectWorkspaceTreeByQuery } from "../helpers";
import { workspaceUseCaseIssues } from "./issues";
import { type WorkspaceUseCaseDeps } from "./types";

export type WorkspaceExportTabInput = {
    tabId: string;
};

export type WorkspaceExportTabResult = Result<WorkspaceTabDocument>;

export type WorkspaceExportTabUseCase = (
    input: WorkspaceExportTabInput,
) => WorkspaceExportTabResult;

export const createExportTabUseCase = ({
    query,
}: Pick<WorkspaceUseCaseDeps, "query">): WorkspaceExportTabUseCase => {
    return ({ tabId }) => {
        const session = query.getTabSession(tabId);
        if (!session) {
            return createErrResult(workspaceUseCaseIssues.tabSessionNotFound(["tabId"], tabId));
        }

        const workspaces = collectWorkspaceTreeByQuery(
            tabId,
            query.getWorkspace,
            query.getWorkspaceChildren,
        );
        if (workspaces.length === 0) {
            return createErrResult(workspaceUseCaseIssues.workspaceNotFound(["tabId"], tabId));
        }

        return createOkResult({
            formatVersion: WORKSPACE_TAB_DOCUMENT_FORMAT_VERSION,
            session,
            workspaces,
        });
    };
};
