import type { UseCase, Result } from "../../../model";
import { createOkResult } from "../../../model";
import type { GraphDocument } from "@gately/shared/infrastructure/ui-engine/model";
import type { GraphDocumentUseCaseDeps } from "./types";

type GraphDocumentEnsureDocumentInput = {
    workspaceId: string;
};

type GraphDocumentEnsureDocumentResult = Result<GraphDocument>;

export type GraphDocumentEnsureDocumentUseCase = UseCase<
    GraphDocumentEnsureDocumentInput,
    GraphDocumentEnsureDocumentResult
>;

export const createEnsureDocumentUseCase = ({
    factory,
    query,
    state,
}: Pick<
    GraphDocumentUseCaseDeps,
    "factory" | "query" | "state"
>): GraphDocumentEnsureDocumentUseCase => {
    return ({ workspaceId }) => {
        const existingDocument = query.getDocument(workspaceId);
        if (existingDocument) {
            return createOkResult(existingDocument);
        }

        const document = factory.createDocument({ workspaceId });
        state.upsertDocument(document);

        return createOkResult(state.getDocument(workspaceId) ?? document);
    };
};
