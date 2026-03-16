import { createErrResult, createOkResult } from "@engine-model/core/result";
import type {
    CreateTabUseCaseDeps,
    EngineCreateTabUseCase,
    EngineCreateTabUseCaseInput,
} from "./types";

export const createCreateTabUseCase = ({
    graphDocument,
    graphRenderer,
    workspace,
    activateWorkspaceScene,
    persistActiveGraphDocument,
}: CreateTabUseCaseDeps): EngineCreateTabUseCase => {
    return async (input: EngineCreateTabUseCaseInput = {}) => {
        const persistResult = persistActiveGraphDocument();
        console.log(persistResult);
        if (!persistResult.ok) {
            return createErrResult(persistResult.issues);
        }

        const createTabResult = await workspace.createTab(input);
        if (!createTabResult.ok || !createTabResult.value) {
            return createErrResult(createTabResult.issues);
        }

        const { tabId } = createTabResult.value;
        const ensureResult = graphDocument.ensureDocument({ workspaceId: tabId });
        if (!ensureResult.ok) {
            return createErrResult(ensureResult.issues);
        }

        if (graphRenderer.query.isMounted() && workspace.query.activeWorkspaceId() === tabId) {
            const activateResult = activateWorkspaceScene(tabId);
            if (!activateResult.ok) {
                return createErrResult(activateResult.issues);
            }
        }

        return createOkResult({ tabId });
    };
};
