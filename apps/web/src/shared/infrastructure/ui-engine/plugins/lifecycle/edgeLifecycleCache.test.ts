import { describe, expect, it, vi } from "vitest";
import { edgeLifecycleCachePlugin } from "./edgeLifecycleCache";

describe("edgeLifecycleCachePlugin", () => {
    it("resets incoming port to high-Z when edge is removed", () => {
        const handlers = new Map<string, (payload: unknown) => void>();
        const edgeMap = {
            remove: vi.fn(),
            save: vi.fn(),
            updateValue: vi.fn(),
        };
        const portMap = {
            get: vi.fn(),
            removeLinkedEdge: vi.fn(),
            removeNodePorts: vi.fn(),
            removePort: vi.fn(),
            save: vi.fn(),
            updateEdge: vi.fn(),
            updateValue: vi.fn(),
        };
        const graph = {
            on: vi.fn((name: string, handler: (payload: unknown) => void) => {
                handlers.set(name, handler);
            }),
            off: vi.fn(),
        };
        const ctx = {
            getService: vi.fn(() => ({
                edges: edgeMap,
                ports: portMap,
            })),
        };
        const node = { id: "node-in" };
        const edge = {
            getData: () => ({
                to: {
                    node,
                    portId: "L:in",
                },
            }),
            getSourceCell: () => null,
            getSourcePortId: () => undefined,
        };

        edgeLifecycleCachePlugin.apply(graph as never, ctx as never);
        handlers.get("edge:removed")?.({ edge });

        expect(portMap.updateValue).toHaveBeenCalledWith(node, "L:in", "value-hiz");
        expect(portMap.removeLinkedEdge).toHaveBeenCalledWith(node, "L:in");
        expect(edgeMap.remove).toHaveBeenCalledWith(edge);
    });
});

