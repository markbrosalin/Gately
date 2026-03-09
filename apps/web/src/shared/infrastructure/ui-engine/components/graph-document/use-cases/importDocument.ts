import type { UseCase, Result } from "../../../model";
import { createErrResult, createOkResult } from "../../../model";
import {
    GRAPH_DOCUMENT_FORMAT_VERSION,
    type GraphDocument,
} from "@gately/shared/infrastructure/ui-engine/model";
import { graphDocumentUseCaseIssues } from "./issues";
import type { GraphDocumentUseCaseDeps } from "./types";

type GraphDocumentImportDocumentInput = {
    document: GraphDocument;
};

type GraphDocumentImportDocumentResult = Result<GraphDocument>;

export type GraphDocumentImportDocumentUseCase = UseCase<
    GraphDocumentImportDocumentInput,
    GraphDocumentImportDocumentResult
>;

export const createImportDocumentUseCase = ({
    state,
}: Pick<GraphDocumentUseCaseDeps, "state">): GraphDocumentImportDocumentUseCase => {
    return ({ document }) => {
        if (document.formatVersion !== GRAPH_DOCUMENT_FORMAT_VERSION) {
            return createErrResult(
                graphDocumentUseCaseIssues.importFormatVersionInvalid(
                    ["document", "formatVersion"],
                    document.formatVersion,
                ),
            );
        }

        state.upsertDocument(document);

        return createOkResult(state.getDocument(document.workspaceId) ?? document);
    };
};
