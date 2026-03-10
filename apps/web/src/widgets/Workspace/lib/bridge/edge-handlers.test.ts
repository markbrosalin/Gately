import { describe, expect, it, vi } from "vitest";
import { createEdgeHandlers } from "./edge-handlers";

type MockNode = {
    id: string;
    isNode: () => boolean;
};

type MockEdge = {
    id: string;
    getData: () => Record<string, unknown>;
    setData: (next: Record<string, unknown>) => void;
    getSourceCell: () => MockNode;
    getSourcePortId: () => string;
    getTargetCell: () => MockNode;
    getTargetPortId: () => string;
};

const createNode = (id: string): MockNode => ({
    id,
    isNode: () => true,
});

const createEdge = (data: Record<string, unknown> = {}): MockEdge => {
    let currentData = { ...data };

    return {
        id: "edge-1",
        getData: () => currentData,
        setData: (next) => {
            currentData = next;
        },
        getSourceCell: () => createNode("node-out"),
        getSourcePortId: () => "R:out",
        getTargetCell: () => createNode("node-in"),
        getTargetPortId: () => "L:in",
    };
};

const createRuntime = (call: ReturnType<typeof vi.fn>) =>
    ({
        getActiveTabId: () => "tab-1",
        isSilent: () => false,
        logicEngine: { call },
        pendingLinks: new Map(),
        runCommand: async <T>(_tabId: string, command: () => Promise<T>) => command(),
        uiEngine: {} as never,
        withSilent: (fn: () => void) => fn(),
    }) as never;

describe("createEdgeHandlers", () => {
    it("stores linkId on edge after successful link", async () => {
        const edge = createEdge();
        const call = vi.fn(async (path: string) => {
            if (path === "/item/link") return { linkId: "link-1" };
            throw new Error(`Unexpected path: ${path}`);
        });
        const runtime = createRuntime(call);
        const { onEdgeConnected } = createEdgeHandlers(runtime);

        await onEdgeConnected({ edge: edge as never });

        expect(edge.getData()).toMatchObject({
            linkId: "link-1",
        });
    });

    it("unlinks by persisted linkId on edge removal", async () => {
        const edge = createEdge({ linkId: "link-1" });
        const call = vi.fn(async () => ({ ok: true }));
        const runtime = createRuntime(call);
        const { onEdgeRemoved } = createEdgeHandlers(runtime);

        await onEdgeRemoved({ edge: edge as never });

        expect(call).toHaveBeenCalledWith("/item/unlink", {
            tabId: "tab-1",
            linkId: "link-1",
        });
    });
});

