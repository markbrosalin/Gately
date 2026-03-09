import type { UseCase, Result } from "../../../model";
import { createErrResult, createOkResult } from "../../../model";
import type { GraphDocument } from "@gately/shared/infrastructure/ui-engine/model";
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
