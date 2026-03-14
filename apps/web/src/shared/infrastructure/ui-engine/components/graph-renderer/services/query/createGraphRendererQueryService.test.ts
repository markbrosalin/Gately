import { describe, expect, it, vi } from "vitest";
import type { GraphRendererInstanceService } from "../instance";
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
            activeWorkspaceId: () => "workspace-1",
            addDisposer: vi.fn(),
            container: () => ({}) as HTMLDivElement,
            graph: () => graph as never,
            open: vi.fn() as never,
            close: vi.fn(),
        };
        const selection: GraphRendererSelectionService = {
            install: vi.fn(),
            clearSelection: vi.fn(),
            selectedCells: vi.fn(() => [selectedNode as never, selectedEdge as never]),
            selectedNodes: vi.fn(() => [selectedNode as never]),
            selectedEdges: vi.fn(() => [selectedEdge as never]),
            hasSelection: vi.fn(() => true),
        };
        const query = createGraphRendererQueryApi(instance, selection);

        expect(query.activeWorkspaceId()).toBe("workspace-1");
        expect(query.isOpen()).toBe(true);
        expect(query.hasSelection()).toBe(true);
        expect(query.selectionCount()).toBe(2);
        expect(query.selectedCellIds()).toEqual(["node-1", "edge-1"]);
        expect(query.selectedNodeIds()).toEqual(["node-1"]);
        expect(query.selectedEdgeIds()).toEqual(["edge-1"]);
        expect(query.graph()).toBe(graph);
    });
});

