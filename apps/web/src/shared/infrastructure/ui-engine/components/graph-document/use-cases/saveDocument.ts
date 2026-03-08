import { UseCase, UseCaseResult, createUseCaseOkResult } from "../../../model";
import type { GraphDocument } from "@gately/shared/infrastructure/ui-engine/model";
import type { GraphDocumentUseCaseDeps } from "./types";

type GraphDocumentSaveDocumentInput = Pick<
    GraphDocument,
    "workspaceId" | "contentJson" | "viewport"
> &
    Partial<Pick<GraphDocument, "extensions">>;

type GraphDocumentSaveDocumentResult = UseCaseResult<GraphDocument>;

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

        return createUseCaseOkResult(state.getDocument(workspaceId) ?? document);
    };
};
