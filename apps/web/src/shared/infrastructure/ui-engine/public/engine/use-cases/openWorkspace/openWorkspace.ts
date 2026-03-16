import { createErrResult, createOkResult } from "@engine-model/core/result";
import type { OpenWorkspaceUseCaseDeps, EngineOpenWorkspaceUseCase } from "./types";

export const createOpenWorkspaceUseCase = ({
    workspace,
    activateWorkspaceScene,
    persistActiveGraphDocument,
}: OpenWorkspaceUseCaseDeps): EngineOpenWorkspaceUseCase => {
    return ({ workspaceId }) => {
        const persistResult = persistActiveGraphDocument();
        if (!persistResult.ok) {
            return createErrResult(persistResult.issues);
        }

        const openResult = workspace.open({ workspaceId });
        if (!openResult.ok || !openResult.value) {
            return createErrResult(openResult.issues);
        }

        const activateResult = activateWorkspaceScene(workspaceId);
        if (!activateResult.ok) {
            return createErrResult(activateResult.issues);
        }

        return createOkResult(openResult.value);
    };
};
