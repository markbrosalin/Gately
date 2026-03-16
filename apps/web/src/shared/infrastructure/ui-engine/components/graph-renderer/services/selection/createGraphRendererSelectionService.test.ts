import { describe, expect, it, vi } from "vitest";
import type { GraphRendererInstanceService } from "../instance";
import { createGraphRendererSelectionApi } from "./createGraphRendererSelectionService";

vi.mock("@antv/x6", () => ({
    Selection: vi.fn().mockImplementation(() => ({
        clean: vi.fn(),
        dispose: vi.fn(),
    })),
}));

describe("createGraphRendererSelectionService", () => {
    it("installs the X6 selection plugin and exposes selected cells", () => {
        const selectedNode = { id: "node-1", isNode: () => true, isEdge: () => false };
        const selectedEdge = { id: "edge-1", isNode: () => false, isEdge: () => true };
        const graph = {
            cleanSelection: vi.fn(),
            getSelectedCells: vi.fn(() => [selectedNode, selectedEdge]),
            use: vi.fn(),
        };
        const instance: GraphRendererInstanceService = {
            container: () => ({}) as HTMLDivElement,
            graph: () => graph as never,
            onGraphMount: vi.fn(),
            onGraphUnmount: vi.fn((listener) => {
                void listener;
                return vi.fn();
            }),
            mount: vi.fn() as never,
            unmount: vi.fn(),
        };
        const service = createGraphRendererSelectionApi(instance);

        service.install();

        expect(graph.use).toHaveBeenCalledTimes(1);
        expect(service.hasSelection()).toBe(true);
        expect(service.selectedCells()).toEqual([selectedNode, selectedEdge]);
        expect(service.selectedNodes()).toEqual([selectedNode]);
        expect(service.selectedEdges()).toEqual([selectedEdge]);

        service.clearSelection();

        expect(graph.cleanSelection).toHaveBeenCalledTimes(1);
    });
});
