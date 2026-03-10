import type { GraphDocument } from "@engine-model";

export type GraphRendererDocumentLoadInput = {
    document: GraphDocument;
    contentJson: Record<string, unknown> | undefined;
};

export type GraphRendererDocumentService = {
    loadDocument: (input: GraphRendererDocumentLoadInput) => void;
    exportDocument: (workspaceId: string) => GraphDocument;
};


