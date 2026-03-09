import type { GraphDocument } from "@gately/shared/infrastructure/ui-engine/model";

export type GraphRendererDocumentLoadInput = {
    document: GraphDocument;
    contentJson: Record<string, unknown> | undefined;
};

export type GraphRendererDocumentService = {
    loadDocument: (input: GraphRendererDocumentLoadInput) => void;
    exportDocument: (workspaceId: string) => GraphDocument;
};
