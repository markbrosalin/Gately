import { describe, expect, it, vi } from "vitest";
import {
    DEFAULT_GRAPH_DOCUMENT_VIEWPORT,
    GRAPH_DOCUMENT_FORMAT_VERSION,
    type GraphDocument,
} from "@gately/shared/infrastructure/ui-engine/model";
import { createGraphDocumentStateService } from "./createGraphDocumentStateService";

const createDocument = (overrides: Partial<GraphDocument> = {}): GraphDocument => ({
    formatVersion: GRAPH_DOCUMENT_FORMAT_VERSION,
    workspaceId: overrides.workspaceId ?? "workspace-1",
    contentJson: overrides.contentJson ?? "",
    viewport: overrides.viewport ?? DEFAULT_GRAPH_DOCUMENT_VIEWPORT,
    createdAt: overrides.createdAt ?? 1,
    ...(overrides.updatedAt !== undefined ? { updatedAt: overrides.updatedAt } : {}),
    ...(overrides.extensions !== undefined ? { extensions: overrides.extensions } : {}),
});

describe("createGraphDocumentStateService", () => {
    it("upserts and removes documents by workspaceId", () => {
        const state = createGraphDocumentStateService();
        const document = createDocument();

        state.upsertDocument(document);

        expect(state.getDocument("workspace-1")).toEqual(document);
        expect(state.documentsByWorkspaceId()).toEqual({
            "workspace-1": document,
        });

        expect(state.removeDocument("workspace-1")).toEqual(document);
        expect(state.getDocument("workspace-1")).toBeUndefined();
    });

    it("preserves createdAt and updates timestamps when content changes", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-03-08T12:00:00.000Z"));

        const state = createGraphDocumentStateService();
        state.upsertDocument(
            createDocument({
                workspaceId: "workspace-2",
                contentJson: '{"cells":[]}',
                createdAt: 100,
            }),
        );

        vi.setSystemTime(new Date("2026-03-08T12:05:00.000Z"));
        state.setContentJson("workspace-2", '{"cells":[{"id":"n-1"}]}');

        expect(state.getDocument("workspace-2")).toEqual({
            formatVersion: GRAPH_DOCUMENT_FORMAT_VERSION,
            workspaceId: "workspace-2",
            contentJson: '{"cells":[{"id":"n-1"}]}',
            viewport: DEFAULT_GRAPH_DOCUMENT_VIEWPORT,
            createdAt: 100,
            updatedAt: new Date("2026-03-08T12:05:00.000Z").getTime(),
        });

        vi.useRealTimers();
    });

    it("updates viewport without replacing the whole document", () => {
        const state = createGraphDocumentStateService();
        state.upsertDocument(createDocument({ workspaceId: "workspace-3" }));

        state.setViewport("workspace-3", {
            zoom: 2,
            tx: 30,
            ty: 40,
        });

        expect(state.getDocument("workspace-3")?.viewport).toEqual({
            zoom: 2,
            tx: 30,
            ty: 40,
        });
        expect(state.getDocument("workspace-3")?.contentJson).toBe("");
    });
});
