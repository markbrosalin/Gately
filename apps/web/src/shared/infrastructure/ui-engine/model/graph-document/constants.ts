import type { GraphDocumentViewport } from "./common";

export const GRAPH_DOCUMENT_FORMAT_VERSION = 1 as const;
export const DEFAULT_GRAPH_DOCUMENT_CONTENT_JSON = "";

export const DEFAULT_GRAPH_DOCUMENT_VIEWPORT: GraphDocumentViewport = {
    zoom: 1,
    tx: 0,
    ty: 0,
};

