import { describe, expect, it } from "vitest";
import { createTestCompositionItem, createTestLogicItem } from "../../__tests__/factories";
import { getCompositionDependencies } from "../getCompositionDependencies";

describe("getCompositionDependencies", () => {
    it("returns unique refs from composition module", () => {
        const item = createTestCompositionItem({
            dependencyRefs: [
                {
                    libraryId: "std",
                    path: ["gates"],
                    itemName: "AND",
                },
                {
                    libraryId: "std",
                    path: ["gates"],
                    itemName: "AND",
                },
            ],
            includePortsModule: false,
        });

        expect(getCompositionDependencies(item)).toEqual([
            {
                libraryId: "std",
                path: ["gates"],
                itemName: "AND",
            },
        ]);
    });

    it("returns empty array when item has no composition module", () => {
        const item = createTestLogicItem({
            modules: [
                {
                    type: "logic",
                    config: {
                        executor: "std.half-adder",
                    },
                },
            ],
        });

        expect(getCompositionDependencies(item)).toEqual([]);
    });
});

