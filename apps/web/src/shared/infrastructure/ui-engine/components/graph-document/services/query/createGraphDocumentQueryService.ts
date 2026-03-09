import type { GraphDocument } from "engine-model";
import type { GraphDocumentStateService } from "../state";
import type { GraphDocumentServiceContext } from "../types";
import type { GraphDocumentQueryService } from "./types";

export const createGraphDocumentQueryApi = (
    state: GraphDocumentStateService,
): GraphDocumentQueryService => {
    const documentsByWorkspaceId = state.documentsByWorkspaceId;
    const getDocument = state.getDocument;

    const documents = (): GraphDocument[] => Object.values(documentsByWorkspaceId());

    const hasDocument = (workspaceId: string): boolean => Boolean(getDocument(workspaceId));

    return {
        documentsByWorkspaceId,
        documents,
        getDocument,
        hasDocument,
    };
};

export const createGraphDocumentQueryService = (
    ctx: GraphDocumentServiceContext,
): GraphDocumentQueryService => {
    return createGraphDocumentQueryApi(ctx.getService("state"));
};
