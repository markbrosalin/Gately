import { createRoot } from "solid-js";
import { describe, expect, it } from "vitest";
import {
    createTestCompositionItem,
    createTestLibrary,
    createTestLogicItem,
} from "../../__tests__/factories";
import { createCatalogQueryApi } from "./createCatalogQueryService";
import { createCatalogStateService } from "../state";

describe("createCatalogQueryService", () => {
    it("reads catalog state and supports semantic queries", () => {
        createRoot((dispose) => {
            const state = createCatalogStateService();
            const item = createTestLogicItem({
                modules: [
                    {
                        type: "logic",
                        config: {
                            executor: "std.and",
                        },
                    },
                    {
                        type: "ports",
                        config: {
                            items: [],
                        },
                    },
                ],
            });
            const compositionItem = createTestCompositionItem({
                ref: {
                    libraryId: "std",
                    path: ["circuits"],
                    itemName: "HALF-ADDER",
                },
                dependencyRefs: [item.ref],
                layout: {
                    width: 180,
                    height: 120,
                },
                boundary: {
                    inputs: [
                        {
                            outerPortId: "in-0",
                            position: { x: 0, y: 20 },
                        },
                    ],
                    outputs: [
                        {
                            outerPortId: "out-0",
                            position: { x: 180, y: 20 },
                        },
                    ],
                },
            });

            state.upsertLibrary(createTestLibrary({ items: [item, compositionItem] }));
            const query = createCatalogQueryApi(state);

            expect(query.librarySummaries()).toEqual([
                {
                    id: "std",
                    name: "Standard",
                    version: "1.0.0",
                },
            ]);
            expect(query.getItem(item.ref)).toEqual(item);
            expect(query.findItemsByKind("logic")).toEqual([item, compositionItem]);
            expect(query.findItemsByModuleType("logic")).toEqual([item]);
            expect(query.getItemComposition(compositionItem.ref)?.type).toBe("composition");
            expect(query.getItemBoundary(compositionItem.ref)).toEqual({
                inputs: [
                    {
                        outerPortId: "in-0",
                        position: { x: 0, y: 20 },
                    },
                ],
                outputs: [
                    {
                        outerPortId: "out-0",
                        position: { x: 180, y: 20 },
                    },
                ],
            });
            expect(query.getDirectDependencies(item.ref)).toEqual([]);

            dispose();
        });
    });

    it("tracks reverse dependencies for composed items", () => {
        createRoot((dispose) => {
            const state = createCatalogStateService();
            const query = createCatalogQueryApi(state);
            const item = createTestLogicItem();
            const compositionItem = createTestCompositionItem({
                dependencyRefs: [item.ref],
            });

            state.upsertLibrary(createTestLibrary({ items: [item, compositionItem] }));

            expect(query.getDependentItems(item.ref)).toEqual([compositionItem]);
            expect(query.hasDependentItems(item.ref)).toBe(true);
            expect(query.getDependentItems(compositionItem.ref)).toEqual([]);
            expect(query.hasDependentItems(compositionItem.ref)).toBe(false);

            dispose();
        });
    });
});

