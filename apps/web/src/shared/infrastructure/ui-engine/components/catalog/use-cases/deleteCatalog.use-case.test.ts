import { createRoot } from "solid-js";
import { describe, expect, it } from "vitest";
import {
    createTestCompositionItem,
    createTestLibrary,
    createTestLogicItem,
} from "../__tests__/factories";
import { createCatalogQueryApi } from "../services/query";
import { createCatalogStateService } from "../services/state";
import { createDeleteItemUseCase } from "./deleteItem";
import { createDeleteLibraryUseCase } from "./deleteLibrary";
import { catalogUseCaseIssueDefs } from "./issues";

describe("catalog delete use-cases", () => {
    it("blocks deleting an item that has dependent items", () => {
        createRoot((dispose) => {
            const state = createCatalogStateService();
            const query = createCatalogQueryApi(state);

            state.upsertLibrary(
                createTestLibrary({
                    id: "std",
                    name: "Standard",
                }),
            );

            const item = createTestLogicItem({
                ref: {
                    libraryId: "std",
                    path: ["gates"],
                    itemName: "AND",
                },
                name: "AND",
                modules: [
                    {
                        type: "logic",
                        config: {
                            executor: "std.and",
                        },
                    },
                ],
            });

            const dependentItem = createTestCompositionItem({
                ref: {
                    libraryId: "std",
                    path: ["circuits"],
                    itemName: "HALF-ADDER",
                },
                dependencyRefs: [item.ref],
            });

            state.upsertItem(item);
            state.upsertItem(dependentItem);

            const deleteItem = createDeleteItemUseCase({ query, state });
            const result = deleteItem({ ref: item.ref });

            expect(result).toMatchObject({
                ok: false,
                issues: [{ code: catalogUseCaseIssueDefs.itemHasDependents.code }],
            });
            expect(query.getItem(item.ref)).toEqual(item);

            dispose();
        });
    });

    it("blocks deleting a library when external items depend on it, but allows internal dependencies", () => {
        createRoot((dispose) => {
            const state = createCatalogStateService();
            const query = createCatalogQueryApi(state);

            const sharedItem = createTestLogicItem({
                ref: {
                    libraryId: "std",
                    path: ["gates"],
                    itemName: "AND",
                },
                name: "AND",
                modules: [
                    {
                        type: "logic",
                        config: {
                            executor: "std.and",
                        },
                    },
                ],
            });

            const internalDependent = createTestCompositionItem({
                ref: {
                    libraryId: "std",
                    path: ["circuits"],
                    itemName: "INTERNAL",
                },
                dependencyRefs: [sharedItem.ref],
            });

            const externalDependent = createTestCompositionItem({
                ref: {
                    libraryId: "custom",
                    path: ["circuits"],
                    itemName: "EXTERNAL",
                },
                dependencyRefs: [sharedItem.ref],
            });

            state.upsertLibrary(
                createTestLibrary({
                    id: "std",
                    name: "Standard",
                    items: [sharedItem, internalDependent],
                }),
            );
            state.upsertLibrary(
                createTestLibrary({
                    id: "custom",
                    name: "Custom",
                    items: [externalDependent],
                }),
            );

            const deleteLibrary = createDeleteLibraryUseCase({ query, state });

            const blockedResult = deleteLibrary({ libraryId: "std" });
            expect(blockedResult).toMatchObject({
                ok: false,
                issues: [{ code: catalogUseCaseIssueDefs.libraryHasDependents.code }],
            });
            expect(query.getLibrary("std")).toBeDefined();

            state.removeLibrary("custom");

            const allowedResult = deleteLibrary({ libraryId: "std" });
            expect(allowedResult).toMatchObject({
                ok: true,
                value: expect.objectContaining({
                    manifest: expect.objectContaining({
                        id: "std",
                    }),
                }),
            });
            expect(query.getLibrary("std")).toBeUndefined();

            dispose();
        });
    });
});
