import type { GraphDocument } from "@gately/shared/infrastructure/ui-engine/model";

export type GraphDocumentStateService = {
    documentsByWorkspaceId: () => Record<string, GraphDocument>;
    getDocument: (workspaceId: string) => GraphDocument | undefined;
    upsertDocument: (document: GraphDocument) => GraphDocument;
    removeDocument: (workspaceId: string) => GraphDocument | undefined;
    setContentJson: (workspaceId: string, contentJson: string) => void;
    setViewport: (workspaceId: string, viewport: GraphDocument["viewport"]) => void;
};
