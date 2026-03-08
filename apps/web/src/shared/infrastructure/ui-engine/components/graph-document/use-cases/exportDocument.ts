import type { UseCase, UseCaseResult } from "../../../model";
import { createUseCaseErrResult, createUseCaseOkResult } from "../../../model";
import type { GraphDocument } from "@gately/shared/infrastructure/ui-engine/model";
import { graphDocumentUseCaseIssues } from "./issues";
import type { GraphDocumentUseCaseDeps } from "./types";

type GraphDocumentExportDocumentInput = {
    workspaceId: string;
};

type GraphDocumentExportDocumentResult = UseCaseResult<GraphDocument>;

export type GraphDocumentExportDocumentUseCase = UseCase<
    GraphDocumentExportDocumentInput,
    GraphDocumentExportDocumentResult
>;

export const createExportDocumentUseCase = ({
    query,
}: Pick<GraphDocumentUseCaseDeps, "query">): GraphDocumentExportDocumentUseCase => {
    return ({ workspaceId }) => {
        const document = query.getDocument(workspaceId);
        if (!document) {
            return createUseCaseErrResult(
                graphDocumentUseCaseIssues.documentNotFound(["workspaceId"], workspaceId),
            );
        }

        return createUseCaseOkResult(document);
    };
};
