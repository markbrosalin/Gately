import {
    createErrResult,
    createOkResult,
    type GraphDocument,
    type Result,
    type UseCase,
} from "@engine-model";
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


