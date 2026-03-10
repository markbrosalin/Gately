import {
    createErrResult,
    createOkResult,
    GRAPH_DOCUMENT_FORMAT_VERSION,
    Result,
    type GraphDocument,
} from "@engine-model";
import type { GraphRendererInstanceService } from "../instance";
import type { GraphRendererDocumentLoadInput, GraphRendererDocumentService } from "./types";

export const parseGraphRendererDocumentContentJson = (
    contentJson: string,
): Result<Record<string, unknown>> => {
    const raw = contentJson.trim();
    if (!raw) {
        return createOkResult();
    }

    try {
        const parsed: Record<string, unknown> = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            return createErrResult();
        }

        return createOkResult(parsed);
    } catch {
        return createErrResult();
    }
};

export const createGraphRendererDocumentApi = (
    instance: GraphRendererInstanceService,
): GraphRendererDocumentService => {
    const loadDocument = ({ document, contentJson }: GraphRendererDocumentLoadInput): void => {
        const graph = instance.graph();
        if (!graph) {
            throw new Error("Cannot load the document. Graph renderer is not open.");
        }

        if (contentJson) {
            graph.fromJSON(contentJson as never);
        } else {
            graph.clearCells();
        }

        graph.zoomTo(document.viewport.zoom);
        graph.translate(document.viewport.tx, document.viewport.ty);
    };

    const exportDocument = (workspaceId: string): GraphDocument => {
        const graph = instance.graph();
        if (!graph) {
            throw new Error("Cannot export the document. Graph renderer is not open.");
        }

        const { tx, ty } = graph.translate();

        return {
            formatVersion: GRAPH_DOCUMENT_FORMAT_VERSION,
            workspaceId,
            contentJson: JSON.stringify(graph.toJSON()),
            viewport: {
                zoom: graph.zoom(),
                tx,
                ty,
            },
            createdAt: Date.now(),
        };
    };

    return {
        loadDocument,
        exportDocument,
    };
};

export const createGraphRendererDocumentService = (
    instance: GraphRendererInstanceService,
): GraphRendererDocumentService => {
    return createGraphRendererDocumentApi(instance);
};
