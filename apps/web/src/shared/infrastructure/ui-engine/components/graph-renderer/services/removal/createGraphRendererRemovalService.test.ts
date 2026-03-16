import { describe, expect, it, vi } from "vitest";
import type { GraphRendererInstanceService } from "../instance";
import type { GraphRendererNodesService } from "../nodes";
import type { GraphRendererSelectionService } from "../selection";
import { createGraphRendererRemovalApi } from "./createGraphRendererRemovalService";

describe("createGraphRendererRemovalService", () => {
    it("removes selection, nodes, and edges through the active graph", () => {
        const selectedNode = { id: "node-1", isNode: () => true, isEdge: () => false };
        const selectedEdge = { id: "edge-1", isNode: () => false, isEdge: () => true };
        const graph = {
            getCellById: vi.fn((cellId: string) =>
                cellId === "edge-1" ? selectedEdge : undefined,
            ),
            removeCells: vi.fn(),
            removeEdge: vi.fn(),
        };
        const instance: GraphRendererInstanceService = {
            container: () => ({}) as HTMLDivElement,
            graph: () => graph as never,
            onGraphMount: vi.fn(),
            onGraphUnmount: vi.fn(),
            mount: vi.fn() as never,
            unmount: vi.fn(),
        };
        const nodes: GraphRendererNodesService = {
            createNode: vi.fn() as never,
            getNode: vi.fn((nodeId: string) =>
                nodeId === "node-1" ? (selectedNode as never) : undefined,
            ),
            removeNode: vi.fn(),
            updateNodeData: vi.fn(),
        };
        const selection: GraphRendererSelectionService = {
            install: vi.fn(),
            clearSelection: vi.fn(),
            selectedCells: vi.fn(() => [selectedNode as never, selectedEdge as never]),
            selectedNodes: vi.fn(() => [selectedNode as never]),
            selectedEdges: vi.fn(() => [selectedEdge as never]),
            hasSelection: vi.fn(() => true),
        };
        const service = createGraphRendererRemovalApi(instance, nodes, selection);

        service.removeSelection();
        expect(graph.removeCells).toHaveBeenCalledWith([selectedNode, selectedEdge]);
        expect(selection.clearSelection).toHaveBeenCalledTimes(1);

        expect(service.removeNode("node-1")).toBe(true);
        expect(nodes.removeNode).toHaveBeenCalledWith("node-1");
        expect(service.removeNode("missing")).toBe(false);

        expect(service.removeEdge("edge-1")).toBe(true);
        expect(graph.removeEdge).toHaveBeenCalledWith("edge-1");
        expect(service.removeEdge("missing")).toBe(false);
    });
});
