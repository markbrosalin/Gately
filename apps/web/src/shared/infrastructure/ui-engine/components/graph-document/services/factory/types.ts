import type { GraphDocument } from "@gately/shared/infrastructure/ui-engine/model";

export type GraphDocumentCreateInput = Pick<GraphDocument, "workspaceId"> &
    Partial<Pick<GraphDocument, "contentJson" | "viewport" | "extensions">>;

export type GraphDocumentFactoryService = {
    createDocument: (input: GraphDocumentCreateInput) => GraphDocument;
};
