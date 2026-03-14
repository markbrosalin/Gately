import { createErrResult } from "@engine-model/core/result";
import { describe, expect, it } from "vitest";
import { createUIEngineUseCaseTestContext } from "../../__tests__/factories";
import { createOpenWorkspaceUseCase } from "./openWorkspace";

describe("createOpenWorkspaceUseCase", () => {
    it("persists the current document, opens the workspace and activates its scene", () => {
        const ctx = createUIEngineUseCaseTestContext();
        const useCase = createOpenWorkspaceUseCase({
            workspace: ctx.deps.workspace,
            activateWorkspaceScene: ctx.internals.activateWorkspaceScene,
            persistActiveGraphDocument: ctx.internals.persistActiveGraphDocument,
        });

        const result = useCase({ workspaceId: "workspace-2" });

        expect(result).toMatchObject({
            ok: true,
            value: expect.objectContaining({ id: "workspace-1" }),
        });
        expect(ctx.fns.persistActiveGraphDocument).toHaveBeenCalledTimes(1);
        expect(ctx.fns.workspaceOpen).toHaveBeenCalledWith({ workspaceId: "workspace-2" });
        expect(ctx.fns.activateWorkspaceScene).toHaveBeenCalledWith("workspace-2");
    });

    it("stops when opening the workspace fails", () => {
        const ctx = createUIEngineUseCaseTestContext();
        ctx.fns.workspaceOpen.mockReturnValue(createErrResult(ctx.fixtures.issues));

        const useCase = createOpenWorkspaceUseCase({
            workspace: ctx.deps.workspace,
            activateWorkspaceScene: ctx.internals.activateWorkspaceScene,
            persistActiveGraphDocument: ctx.internals.persistActiveGraphDocument,
        });

        const result = useCase({ workspaceId: "workspace-2" });

        expect(result.ok).toBe(false);
        expect(ctx.fns.activateWorkspaceScene).not.toHaveBeenCalled();
    });
});
