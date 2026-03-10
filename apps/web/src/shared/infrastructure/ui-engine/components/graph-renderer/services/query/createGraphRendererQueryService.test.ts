import { describe, expect, it, vi } from "vitest";
import type { GraphRendererInstanceService } from "../instance";
import { createGraphRendererQueryApi } from "./createGraphRendererQueryService";

describe("createGraphRendererQueryService", () => {
    it("reads instance lifecycle state", () => {
        const graph = {
            getSelectedCellCount: vi.fn(() => 3),
        };
        const instance: GraphRendererInstanceService = {
            activeWorkspaceId: () => "workspace-1",
            container: () => ({}) as HTMLDivElement,
            graph: () => graph as never,
            open: vi.fn() as never,
            close: vi.fn(),
        };
        const query = createGraphRendererQueryApi(instance);

        expect(query.activeWorkspaceId()).toBe("workspace-1");
        expect(query.isOpen()).toBe(true);
        expect(query.selectionCount()).toBe(3);
        expect(query.graph()).toBe(graph);
    });
});

