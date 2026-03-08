import type { UseCase, UseCaseResult } from "../../../model";
import { createUseCaseOkResult } from "../../../model";
import type { GraphDocument } from "@gately/shared/infrastructure/ui-engine/model";
import type { GraphDocumentUseCaseDeps } from "./types";

type GraphDocumentEnsureDocumentInput = {
    workspaceId: string;
};

type GraphDocumentEnsureDocumentResult = UseCaseResult<GraphDocument>;

export type GraphDocumentEnsureDocumentUseCase = UseCase<
    GraphDocumentEnsureDocumentInput,
    GraphDocumentEnsureDocumentResult
>;

export const createEnsureDocumentUseCase = ({
    factory,
    query,
    state,
}: Pick<GraphDocumentUseCaseDeps, "factory" | "query" | "state">): GraphDocumentEnsureDocumentUseCase => {
    return ({ workspaceId }) => {
        const existingDocument = query.getDocument(workspaceId);
        if (existingDocument) {
            return createUseCaseOkResult(existingDocument);
        }

        const document = factory.createDocument({ workspaceId });
        state.upsertDocument(document);

        return createUseCaseOkResult(state.getDocument(workspaceId) ?? document);
    };
};
