import { describe, expect, it, vi } from "vitest";
import type { GraphRendererInstanceService } from "../instance";
import type { GraphRendererDocumentService } from "../document/types";
import type { GraphRendererSelectionService } from "../selection";
import { createGraphRendererQueryApi } from "./createGraphRendererQueryService";

describe("createGraphRendererQueryService", () => {
    it("reads instance lifecycle state", () => {
        const graph = {
            getSelectedCellCount: vi.fn(() => 3),
        };
        const selectedNode = { id: "node-1" };
        const selectedEdge = { id: "edge-1" };
        const instance: GraphRendererInstanceService = {
            container: () => ({}) as HTMLDivElement,
            graph: () => graph as never,
            mount: vi.fn() as never,
            unmount: vi.fn(),
        };
        const document: GraphRendererDocumentService = {
            activeWorkspaceId: vi.fn(() => "workspace-1"),
            clearActiveWorkspaceId: vi.fn(),
            loadDocument: vi.fn(),
            exportDocument: vi.fn() as never,
        };
        const selection: GraphRendererSelectionService = {
            install: vi.fn(),
            clearSelection: vi.fn(),
            selectedCells: vi.fn(() => [selectedNode as never, selectedEdge as never]),
            selectedNodes: vi.fn(() => [selectedNode as never]),
            selectedEdges: vi.fn(() => [selectedEdge as never]),
            hasSelection: vi.fn(() => true),
        };
        const query = createGraphRendererQueryApi(instance, document, selection);

        expect(query.activeWorkspaceId()).toBe("workspace-1");
        expect(query.isMounted()).toBe(true);
        expect(query.hasSelection()).toBe(true);
        expect(query.selectionCount()).toBe(2);
        expect(query.selectedCellIds()).toEqual(["node-1", "edge-1"]);
        expect(query.selectedNodeIds()).toEqual(["node-1"]);
        expect(query.selectedEdgeIds()).toEqual(["edge-1"]);
        expect(query.graph()).toBe(graph);
    });
});

