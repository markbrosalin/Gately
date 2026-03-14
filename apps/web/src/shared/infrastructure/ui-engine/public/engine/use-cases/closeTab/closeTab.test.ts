import { describe, expect, it } from "vitest";
import { createUIEngineUseCaseTestContext } from "../../__tests__/factories";
import { createCloseTabUseCase } from "./closeTab";

describe("createCloseTabUseCase", () => {
    it("persists the active tab and activates the next workspace scene after close", () => {
        const ctx = createUIEngineUseCaseTestContext();
        ctx.fns.workspaceActiveTabId.mockReturnValue("tab-1");
        ctx.fns.workspaceActiveWorkspaceId.mockReturnValue("workspace-2");

        const useCase = createCloseTabUseCase({
            graphRenderer: ctx.deps.graphRenderer,
            workspace: ctx.deps.workspace,
            activateWorkspaceScene: ctx.internals.activateWorkspaceScene,
            persistActiveGraphDocument: ctx.internals.persistActiveGraphDocument,
            syncRendererReady: ctx.internals.syncRendererReady,
        });

        const result = useCase({ tabId: "tab-1" });

        expect(result.ok).toBe(true);
        expect(ctx.fns.persistActiveGraphDocument).toHaveBeenCalledTimes(1);
        expect(ctx.fns.workspaceCloseTab).toHaveBeenCalledWith({
            tabId: "tab-1",
            conditions: undefined,
        });
        expect(ctx.fns.activateWorkspaceScene).toHaveBeenCalledWith("workspace-2");
        expect(ctx.fns.graphRendererClose).not.toHaveBeenCalled();
    });

    it("closes the renderer and syncs ready state when no active workspace remains", () => {
        const ctx = createUIEngineUseCaseTestContext();
        ctx.fns.workspaceActiveTabId.mockReturnValue("tab-1");
        ctx.fns.workspaceActiveWorkspaceId.mockReturnValue(undefined);

        const useCase = createCloseTabUseCase({
            graphRenderer: ctx.deps.graphRenderer,
            workspace: ctx.deps.workspace,
            activateWorkspaceScene: ctx.internals.activateWorkspaceScene,
            persistActiveGraphDocument: ctx.internals.persistActiveGraphDocument,
            syncRendererReady: ctx.internals.syncRendererReady,
        });

        const result = useCase({ tabId: "tab-1" });

        expect(result.ok).toBe(true);
        expect(ctx.fns.graphRendererClose).toHaveBeenCalledTimes(1);
        expect(ctx.fns.syncRendererReady).toHaveBeenCalledTimes(1);
    });

    it("does not persist when a non-active tab is closed", () => {
        const ctx = createUIEngineUseCaseTestContext();
        ctx.fns.workspaceActiveTabId.mockReturnValue("tab-2");
        ctx.fns.workspaceActiveWorkspaceId.mockReturnValue("workspace-2");

        const useCase = createCloseTabUseCase({
            graphRenderer: ctx.deps.graphRenderer,
            workspace: ctx.deps.workspace,
            activateWorkspaceScene: ctx.internals.activateWorkspaceScene,
            persistActiveGraphDocument: ctx.internals.persistActiveGraphDocument,
            syncRendererReady: ctx.internals.syncRendererReady,
        });

        const result = useCase({ tabId: "tab-1" });

        expect(result.ok).toBe(true);
        expect(ctx.fns.persistActiveGraphDocument).not.toHaveBeenCalled();
    });
});
