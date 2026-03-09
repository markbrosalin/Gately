import type { UseCase, Result } from "../../../model";
import { createErrResult, createOkResult } from "../../../model";
import type { GraphDocument } from "@gately/shared/infrastructure/ui-engine/model";
import { graphDocumentUseCaseIssues } from "./issues";
import type { GraphDocumentUseCaseDeps } from "./types";

type GraphDocumentExportDocumentInput = {
    workspaceId: string;
};

type GraphDocumentExportDocumentResult = Result<GraphDocument>;

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
            return createErrResult(
                graphDocumentUseCaseIssues.documentNotFound(["workspaceId"], workspaceId),
            );
        }

        return createOkResult(document);
    };
};
