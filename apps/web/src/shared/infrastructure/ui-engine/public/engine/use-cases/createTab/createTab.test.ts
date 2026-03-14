import { createErrResult } from "@engine-model/core/result";
import { describe, expect, it } from "vitest";
import { createUIEngineUseCaseTestContext } from "../../__tests__/factories";
import { createCreateTabUseCase } from "./createTab";

describe("createCreateTabUseCase", () => {
    it("persists the active document, creates a tab, ensures its document and activates its scene", async () => {
        const ctx = createUIEngineUseCaseTestContext();
        ctx.fns.workspaceActiveWorkspaceId.mockReturnValue("tab-1");

        const useCase = createCreateTabUseCase({
            ...ctx.deps,
            activateWorkspaceScene: ctx.internals.activateWorkspaceScene,
            persistActiveGraphDocument: ctx.internals.persistActiveGraphDocument,
        });

        const result = await useCase({});

        expect(result).toMatchObject({
            ok: true,
            value: { tabId: "tab-1" },
        });
        expect(ctx.fns.persistActiveGraphDocument).toHaveBeenCalledTimes(1);
        expect(ctx.fns.workspaceCreateTab).toHaveBeenCalledWith({});
        expect(ctx.fns.graphDocumentEnsureDocument).toHaveBeenCalledWith({ workspaceId: "tab-1" });
        expect(ctx.fns.activateWorkspaceScene).toHaveBeenCalledWith("tab-1");
    });

    it("does not activate the scene when no container is mounted", async () => {
        const ctx = createUIEngineUseCaseTestContext();
        ctx.fns.getContainer.mockReturnValue(undefined);

        const useCase = createCreateTabUseCase({
            ...ctx.deps,
            activateWorkspaceScene: ctx.internals.activateWorkspaceScene,
            persistActiveGraphDocument: ctx.internals.persistActiveGraphDocument,
        });

        const result = await useCase({});

        expect(result.ok).toBe(true);
        expect(ctx.fns.activateWorkspaceScene).not.toHaveBeenCalled();
    });

    it("propagates persist issues before creating a tab", async () => {
        const ctx = createUIEngineUseCaseTestContext();
        ctx.fns.persistActiveGraphDocument.mockReturnValue(createErrResult(ctx.fixtures.issues));

        const useCase = createCreateTabUseCase({
            ...ctx.deps,
            activateWorkspaceScene: ctx.internals.activateWorkspaceScene,
            persistActiveGraphDocument: ctx.internals.persistActiveGraphDocument,
        });

        const result = await useCase({});

        expect(result.ok).toBe(false);
        expect(ctx.fns.workspaceCreateTab).not.toHaveBeenCalled();
    });
});
