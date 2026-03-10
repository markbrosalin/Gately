import {
    createErrResult,
    createOkResult,
    type GraphDocument,
    type Result,
    type UseCase,
} from "@engine-model";
import { graphDocumentUseCaseIssues } from "./issues";
import type { GraphDocumentUseCaseDeps } from "./types";

type GraphDocumentRemoveDocumentInput = {
    workspaceId: string;
};

type GraphDocumentRemoveDocumentResult = Result<GraphDocument>;

export type GraphDocumentRemoveDocumentUseCase = UseCase<
    GraphDocumentRemoveDocumentInput,
    GraphDocumentRemoveDocumentResult
>;

export const createRemoveDocumentUseCase = ({
    state,
}: Pick<GraphDocumentUseCaseDeps, "state">): GraphDocumentRemoveDocumentUseCase => {
    return ({ workspaceId }) => {
        const removedDocument = state.removeDocument(workspaceId);
        if (!removedDocument) {
            return createErrResult(
                graphDocumentUseCaseIssues.documentNotFound(["workspaceId"], workspaceId),
            );
        }

        return createOkResult(removedDocument);
    };
};


