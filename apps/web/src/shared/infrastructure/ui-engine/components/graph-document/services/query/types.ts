import type { GraphDocument } from "@engine-model";

export type GraphDocumentQueryService = {
    documentsByWorkspaceId: () => Record<string, GraphDocument>;
    documents: () => GraphDocument[];
    getDocument: (workspaceId: string) => GraphDocument | undefined;
    hasDocument: (workspaceId: string) => boolean;
};


