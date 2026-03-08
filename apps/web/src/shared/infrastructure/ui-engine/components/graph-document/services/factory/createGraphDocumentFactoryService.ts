import {
    DEFAULT_GRAPH_DOCUMENT_CONTENT_JSON,
    DEFAULT_GRAPH_DOCUMENT_VIEWPORT,
    GRAPH_DOCUMENT_FORMAT_VERSION,
    type GraphDocument,
} from "@gately/shared/infrastructure/ui-engine/model";
import type { GraphDocumentCreateInput, GraphDocumentFactoryService } from "./types";

export const createGraphDocumentFactoryService = (): GraphDocumentFactoryService => {
    const createDocument = (input: GraphDocumentCreateInput): GraphDocument => ({
        formatVersion: GRAPH_DOCUMENT_FORMAT_VERSION,
        workspaceId: input.workspaceId,
        contentJson: input.contentJson ?? DEFAULT_GRAPH_DOCUMENT_CONTENT_JSON,
        viewport: input.viewport ?? DEFAULT_GRAPH_DOCUMENT_VIEWPORT,
        createdAt: Date.now(),
        ...(input.extensions !== undefined ? { extensions: input.extensions } : {}),
    });

    return {
        createDocument,
    };
};
