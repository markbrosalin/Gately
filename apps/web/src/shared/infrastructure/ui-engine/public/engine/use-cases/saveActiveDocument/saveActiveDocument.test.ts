import { createErrResult, createOkResult } from "@engine-model/core/result";
import { describe, expect, it } from "vitest";
import {
    createTestGraphDocument,
    createUIEngineUseCaseTestContext,
} from "../../__tests__/factories";
import { createSaveActiveDocumentUseCase } from "./saveActiveDocument";

describe("createSaveActiveDocumentUseCase", () => {
    it("returns the persisted document when renderer and workspace are active", () => {
        const ctx = createUIEngineUseCaseTestContext();
        const savedDocument = createTestGraphDocument({ workspaceId: "workspace-2" });
        ctx.fns.persistActiveGraphDocument.mockReturnValue(createOkResult(savedDocument));

        const useCase = createSaveActiveDocumentUseCase({
            graphRenderer: ctx.deps.graphRenderer,
            workspace: ctx.deps.workspace,
            persistActiveGraphDocument: ctx.internals.persistActiveGraphDocument,
        });

        const result = useCase();

        expect(result).toMatchObject({
            ok: true,
            value: savedDocument,
        });
    });

    it("returns an issue when there is no active workspace", () => {
        const ctx = createUIEngineUseCaseTestContext();
        ctx.fns.workspaceActiveWorkspaceId.mockReturnValue(undefined);

        const useCase = createSaveActiveDocumentUseCase({
            graphRenderer: ctx.deps.graphRenderer,
            workspace: ctx.deps.workspace,
            persistActiveGraphDocument: ctx.internals.persistActiveGraphDocument,
        });

        const result = useCase();

        expect(result.ok).toBe(false);
        expect(ctx.fns.persistActiveGraphDocument).not.toHaveBeenCalled();
    });

    it("propagates persist issues", () => {
        const ctx = createUIEngineUseCaseTestContext();
        ctx.fns.persistActiveGraphDocument.mockReturnValue(createErrResult(ctx.fixtures.issues));

        const useCase = createSaveActiveDocumentUseCase({
            graphRenderer: ctx.deps.graphRenderer,
            workspace: ctx.deps.workspace,
            persistActiveGraphDocument: ctx.internals.persistActiveGraphDocument,
        });

        const result = useCase();

        expect(result.ok).toBe(false);
    });
});
