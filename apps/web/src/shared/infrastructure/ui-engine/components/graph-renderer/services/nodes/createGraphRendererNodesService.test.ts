import { describe, expect, it, vi } from "vitest";
import type { GraphRendererInstanceService } from "../instance";
import { createGraphRendererNodesApi } from "./createGraphRendererNodesService";

describe("createGraphRendererNodesService", () => {
    it("creates, reads and removes nodes through the active graph", () => {
        const nodes = new Map<string, unknown>();
        const graph = {
            addNode: vi.fn((props: { id?: string }) => {
                const node = {
                    id: props.id ?? "node-1",
                    isNode: () => true,
                    getData: vi.fn(() => props),
                    setData: vi.fn(),
                };
                nodes.set(node.id, node);
                return node;
            }),
            getCellById: vi.fn((nodeId: string) => nodes.get(nodeId)),
            removeNode: vi.fn((nodeId: string) => {
                nodes.delete(nodeId);
            }),
        };
        const instance: GraphRendererInstanceService = {
            activeWorkspaceId: () => "workspace-1",
            container: () => ({}) as HTMLDivElement,
            graph: () => graph as never,
            open: vi.fn() as never,
            close: vi.fn(),
        };
        const service = createGraphRendererNodesApi(instance);

        const node = service.createNode({
            id: "node-1",
            x: 0,
            y: 0,
            width: 10,
            height: 10,
            data: {
                kind: "logic",
            },
        });

        expect(graph.addNode).toHaveBeenCalledTimes(1);
        expect(service.getNode("node-1")).toBe(node);

        service.removeNode("node-1");

        expect(graph.removeNode).toHaveBeenCalledWith("node-1");
        expect(service.getNode("node-1")).toBeUndefined();
    });
});
