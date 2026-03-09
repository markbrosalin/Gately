import type { AsyncUseCase, Result } from "../../../model";
import { createErrResult, createOkResult } from "../../../model";
import { WorkspaceTabFactoryInput } from "../services";
import { workspaceUseCaseIssues } from "./issues";
import type { WorkspaceUseCaseDeps } from "./types";

type WorkspaceCreateTabResult = Result<{ tabId: string }>;

export type WorkspaceCreateTabUseCase = AsyncUseCase<
    WorkspaceCreateTabUseCaseInput,
    WorkspaceCreateTabResult
>;

export type WorkspaceCreateTabUseCaseInput = Omit<WorkspaceTabFactoryInput, "id"> & {
    options?: { setActive?: boolean };
};

export const createCreateTabUseCase = ({
    external,
    factory,
    state,
}: Pick<WorkspaceUseCaseDeps, "external" | "factory" | "state">): WorkspaceCreateTabUseCase => {
    return async (input) => {
        const logicEngine = external.logicEngine;
        if (!logicEngine) {
            return createErrResult(workspaceUseCaseIssues.logicEngineNotConfigured());
        }

        const result = (await logicEngine.call("/tab/create", {})) as { tabId?: string };
        const tabId = result.tabId;

        if (!tabId) {
            return createErrResult(workspaceUseCaseIssues.logicEngineNotConfigured());
        }

        const rootWorkspace = factory.createTabWorkspace({
            id: tabId,
            title: input.title,
            childrenIds: input.childrenIds,
        });
        const session = factory.createTabSession({
            rootWorkspaceId: tabId,
        });

        state.upsertTabSession(session, rootWorkspace);
        state.setNavigationPath(tabId, [tabId]);

        if (input.options?.setActive ?? true) {
            state.setActiveTab(tabId);
            state.setActiveWorkspace(tabId);
        }

        return createOkResult({ tabId });
    };
};
