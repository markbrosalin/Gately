import type { CatalogLogicItem } from "engine-model/catalog";
import { describe, expect, it } from "vitest";
import { createNodeVisual } from "../createNodeVisual";
import { buildStdLogicItemMarkup } from "engine-components/catalog/specs/std-library";

const createLogicItem = (overrides: Partial<CatalogLogicItem> = {}): CatalogLogicItem => ({
    ref: {
        libraryId: "std",
        path: ["logic"],
        itemName: "test-item",
    },
    kind: "logic",
    meta: {
        name: "Test item",
        createdAt: 0,
    },
    layout: {
        width: 64,
        height: 32,
    },
    modules: [],
    ...overrides,
});

describe("createNodeVisual", () => {
    it("falls back to base node visual when visual module is absent", () => {
        const result = createNodeVisual(createLogicItem(), { minWidth: 64, minHeight: 32 });

        expect(result.markup).toEqual(buildStdLogicItemMarkup());
        expect(result.attrs?.body?.width).toBe(64);
        expect(result.attrs?.body?.height).toBe(32);
    });

    it("merges visual attrs, markup and static class patch", () => {
        const result = createNodeVisual(
            createLogicItem({
                modules: [
                    {
                        type: "visual",
                        config: {
                            base: {
                                markup: [{ tagName: "rect", selector: "custom-body" }],
                                attrs: {
                                    body: {
                                        fill: "red",
                                        class: "body-base old",
                                    },
                                },
                                class: {
                                    body: {
                                        add: ["next"],
                                        remove: ["old"],
                                    },
                                },
                            },
                        },
                    },
                ],
            }),
            { minWidth: 64, minHeight: 32 },
        );

        expect(result.markup).toEqual([{ tagName: "rect", selector: "custom-body" }]);
        expect(result.attrs?.body?.fill).toBe("red");
        expect(result.attrs?.body?.class).toBe("body-base next");
    });
});
