import {
    createErrResult,
    createOkResult,
    type GraphDocument,
    type Result,
    type UseCase,
} from "@engine-model";
import type { GraphDocumentUseCaseDeps } from "./types";
import { graphDocumentUseCaseIssues } from "./issues";

type GraphDocumentSaveDocumentInput = Pick<
    GraphDocument,
    "workspaceId" | "contentJson" | "viewport"
> &
    Partial<Pick<GraphDocument, "extensions">>;

type GraphDocumentSaveDocumentResult = Result<GraphDocument>;

export type GraphDocumentSaveDocumentUseCase = UseCase<
    GraphDocumentSaveDocumentInput,
    GraphDocumentSaveDocumentResult
>;

export const createSaveDocumentUseCase = ({
    factory,
    query,
    state,
}: Pick<
    GraphDocumentUseCaseDeps,
    "factory" | "query" | "state"
>): GraphDocumentSaveDocumentUseCase => {
    return ({ workspaceId, contentJson, viewport, extensions }) => {
        const existingDocument = query.getDocument(workspaceId);

        if (!workspaceId) {
            return createErrResult(graphDocumentUseCaseIssues.workspaceIdIsUndefined());
        }

        const document = existingDocument
            ? {
                  ...existingDocument,
                  contentJson,
                  viewport,
                  ...(extensions !== undefined ? { extensions } : {}),
              }
            : factory.createDocument({
                  workspaceId,
                  contentJson,
                  viewport,
                  ...(extensions !== undefined ? { extensions } : {}),
              });

        state.upsertDocument(document);

        return createOkResult(document);
    };
};
