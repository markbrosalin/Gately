import { createErrResult } from "@engine-model/core/result";
import { describe, expect, it } from "vitest";
import { createUIEngineUseCaseTestContext } from "../../__tests__/factories";
import { createCreateNodeFromCatalogItemUseCase } from "./createNodeFromCatalogItem";

describe("createCreateNodeFromCatalogItemUseCase", () => {
    it("creates a node from catalog item inside the active renderer scene", () => {
        const ctx = createUIEngineUseCaseTestContext();
        const useCase = createCreateNodeFromCatalogItemUseCase({
            catalog: ctx.deps.catalog,
            graphRenderer: ctx.deps.graphRenderer,
            workspace: ctx.deps.workspace,
        });

        const result = useCase({ ref: ctx.fixtures.item.ref });

        expect(result).toMatchObject({
            ok: true,
            value: expect.objectContaining({ id: "node-1" }),
        });
        expect(ctx.fns.graphRendererCreateNode).toHaveBeenCalledWith({
            item: ctx.fixtures.item,
            position: undefined,
        });
    });

    it("returns an issue when catalog item is missing", () => {
        const ctx = createUIEngineUseCaseTestContext();
        ctx.fns.catalogGetItem.mockReturnValue(undefined);

        const useCase = createCreateNodeFromCatalogItemUseCase({
            catalog: ctx.deps.catalog,
            graphRenderer: ctx.deps.graphRenderer,
            workspace: ctx.deps.workspace,
        });

        const result = useCase({ ref: ctx.fixtures.item.ref });

        expect(result.ok).toBe(false);
        expect(ctx.fns.graphRendererCreateNode).not.toHaveBeenCalled();
    });

    it("propagates renderer create issues", () => {
        const ctx = createUIEngineUseCaseTestContext();
        ctx.fns.graphRendererCreateNode.mockReturnValue(createErrResult(ctx.fixtures.issues));

        const useCase = createCreateNodeFromCatalogItemUseCase({
            catalog: ctx.deps.catalog,
            graphRenderer: ctx.deps.graphRenderer,
            workspace: ctx.deps.workspace,
        });

        const result = useCase({ ref: ctx.fixtures.item.ref });

        expect(result.ok).toBe(false);
    });
});
