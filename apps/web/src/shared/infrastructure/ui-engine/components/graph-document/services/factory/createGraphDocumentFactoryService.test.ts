import { describe, expect, it, vi } from "vitest";
import {
    DEFAULT_GRAPH_DOCUMENT_CONTENT_JSON,
    DEFAULT_GRAPH_DOCUMENT_VIEWPORT,
    GRAPH_DOCUMENT_FORMAT_VERSION,
} from "engine-model";
import { createGraphDocumentFactoryService } from "./createGraphDocumentFactoryService";

describe("createGraphDocumentFactoryService", () => {
    it("creates a graph document with normalized defaults", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-03-08T12:00:00.000Z"));

        const factory = createGraphDocumentFactoryService();
        const document = factory.createDocument({
            workspaceId: "workspace-1",
        });

        expect(document).toEqual({
            formatVersion: GRAPH_DOCUMENT_FORMAT_VERSION,
            workspaceId: "workspace-1",
            contentJson: DEFAULT_GRAPH_DOCUMENT_CONTENT_JSON,
            viewport: DEFAULT_GRAPH_DOCUMENT_VIEWPORT,
            createdAt: new Date("2026-03-08T12:00:00.000Z").getTime(),
        });

        vi.useRealTimers();
    });
});
