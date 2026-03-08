import { Timestamps } from "../core/entity";
import { GRAPH_DOCUMENT_FORMAT_VERSION } from "./constants";
import type { GraphDocumentExtensions, GraphDocumentViewport } from "./common";

export type GraphDocument = Timestamps & {
    formatVersion: typeof GRAPH_DOCUMENT_FORMAT_VERSION;
    workspaceId: string;
    contentJson: string;
    viewport: GraphDocumentViewport;
    extensions?: GraphDocumentExtensions;
};

export type GraphDocumentPatch = Partial<Pick<GraphDocument, "contentJson" | "extensions">> & {
    viewport?: Partial<GraphDocumentViewport>;
};
