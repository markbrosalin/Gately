import type { GraphDocument } from "@engine-model/graph-document";

export type GraphRendererDocumentLoadInput = {
    document: GraphDocument;
    contentJson: Record<string, unknown> | undefined;
};

export type GraphRendererDocumentService = {
    loadDocument: (input: GraphRendererDocumentLoadInput) => void;
    exportDocument: (workspaceId: string) => GraphDocument;
};


