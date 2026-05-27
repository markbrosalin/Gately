import { createErrResult, createOkResult } from "@engine-model/core/result";
import type {
    CreateTabUseCaseDeps,
    EngineCreateTabUseCase,
    EngineCreateTabUseCaseInput,
} from "./types";

export const createCreateTabUseCase = ({
    workspace,
    graphDocument,
    persistActiveGraphDocument,
}: CreateTabUseCaseDeps): EngineCreateTabUseCase => {
    return async (input: EngineCreateTabUseCaseInput = {}) => {
        const persistResult = persistActiveGraphDocument();
        if (!persistResult.ok) {
            return createErrResult(persistResult.issues);
        }

        const createTabResult = await workspace.createTab(input);
        if (!createTabResult.ok) {
            return createErrResult(createTabResult.issues);
        }

        const { tabId } = createTabResult.value;

        const ensureDocumentResult = graphDocument.ensureDocument({ workspaceId: tabId });
        if (!ensureDocumentResult.ok) {
            return createErrResult(ensureDocumentResult.issues);
        }

        return createOkResult({ tabId });
    };
};
