import type { UseCase, UseCaseResult } from "../../../model";
import { createUseCaseErrResult, createUseCaseOkResult } from "../../../model";
import type { GraphDocument } from "@gately/shared/infrastructure/ui-engine/model";
import { graphDocumentUseCaseIssues } from "./issues";
import type { GraphDocumentUseCaseDeps } from "./types";

type GraphDocumentRemoveDocumentInput = {
    workspaceId: string;
};

type GraphDocumentRemoveDocumentResult = UseCaseResult<GraphDocument>;

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
            return createUseCaseErrResult(
                graphDocumentUseCaseIssues.documentNotFound(["workspaceId"], workspaceId),
            );
        }

        return createUseCaseOkResult(removedDocument);
    };
};
