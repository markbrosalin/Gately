import { createRoot } from "solid-js";
import { describe, expect, it } from "vitest";
import {
    DEFAULT_GRAPH_DOCUMENT_VIEWPORT,
    GRAPH_DOCUMENT_FORMAT_VERSION,
    type GraphDocument,
} from "engine-model";
import { buildSharedServices } from "../../shared-services";
import { createGraphDocument } from "./createGraphDocument";

describe("createGraphDocument", () => {
    it("wires graph-document use cases through the public component API", () => {
        createRoot((dispose) => {
            const shared = buildSharedServices();
            const graphDocument = createGraphDocument({
                external: {},
                getSharedService: shared.getService,
            });

            const ensureResult = graphDocument.ensureDocument({
                workspaceId: "workspace-1",
            });
            expect(ensureResult.ok).toBe(true);
            if (!ensureResult.ok) {
                throw new Error("Expected ensureDocument to succeed");
            }
            expect(ensureResult.value.contentJson).toBe("");

            const saveResult = graphDocument.saveDocument({
                workspaceId: "workspace-1",
                contentJson: '{"cells":[{"id":"n1"}]}',
                viewport: {
                    zoom: 2,
                    tx: 10,
                    ty: 20,
                },
            });
            expect(saveResult.ok).toBe(true);
            if (!saveResult.ok) {
                throw new Error("Expected saveDocument to succeed");
            }
            expect(graphDocument.query.getDocument("workspace-1")?.contentJson).toBe(
                '{"cells":[{"id":"n1"}]}',
            );

            const exportResult = graphDocument.exportDocument({
                workspaceId: "workspace-1",
            });
            expect(exportResult.ok).toBe(true);
            if (!exportResult.ok) {
                throw new Error("Expected exportDocument to succeed");
            }
            expect(exportResult.value.viewport).toEqual({
                zoom: 2,
                tx: 10,
                ty: 20,
            });

            const removeResult = graphDocument.removeDocument({
                workspaceId: "workspace-1",
            });
            expect(removeResult.ok).toBe(true);
            expect(graphDocument.query.hasDocument("workspace-1")).toBe(false);

            dispose();
        });
    });

    it("imports documents through the public component API", () => {
        createRoot((dispose) => {
            const shared = buildSharedServices();
            const graphDocument = createGraphDocument({
                external: {},
                getSharedService: shared.getService,
            });
            const document: GraphDocument = {
                formatVersion: GRAPH_DOCUMENT_FORMAT_VERSION,
                workspaceId: "workspace-2",
                contentJson: '{"cells":[{"id":"n2"}]}',
                viewport: DEFAULT_GRAPH_DOCUMENT_VIEWPORT,
                createdAt: 1,
            };

            const importResult = graphDocument.importDocument({ document });

            expect(importResult.ok).toBe(true);
            expect(graphDocument.query.getDocument("workspace-2")).toEqual(document);

            dispose();
        });
    });
});
