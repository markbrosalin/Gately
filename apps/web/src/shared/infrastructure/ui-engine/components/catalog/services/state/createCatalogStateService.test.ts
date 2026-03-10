import { createRoot } from "solid-js";
import { describe, expect, it } from "vitest";
import { createCatalogFactoryService } from "../factory";
import { createCatalogStateService } from "./createCatalogStateService";

describe("createCatalogStateService", () => {
    it("stores libraries inside the in-memory document", () => {
        createRoot((dispose) => {
            const state = createCatalogStateService();
            const factory = createCatalogFactoryService();
            const library = factory.createLibrary({
                id: "std",
                name: "Standard",
            });

            state.upsertLibrary(library);

            expect(state.document()).toEqual({
                formatVersion: 1,
                libraries: [library],
            });
            expect(state.libraries()).toEqual([library]);

            dispose();
        });
    });

    it("upserts and removes items inside a registered library", () => {
        createRoot((dispose) => {
            const state = createCatalogStateService();
            const factory = createCatalogFactoryService();
            state.upsertLibrary(
                factory.createLibrary({
                    id: "std",
                    name: "Standard",
                }),
            );

            const item = factory.createItem({
                ref: {
                    libraryId: "std",
                    path: ["gates"],
                    itemName: "AND",
                },
                kind: "logic",
                name: "AND",
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
                            items: [
                                {
                                    id: "in-1",
                                    direction: "input",
                                },
                                {
                                    id: "out-1",
                                    direction: "output",
                                },
                            ],
                        },
                    },
                ],
            });

            state.upsertItem(item);

            expect(state.document().libraries[0]?.items).toEqual([item]);

            const removed = state.removeItem(item);

            expect(removed).toEqual(item);
            expect(state.document().libraries[0]?.items).toEqual([]);

            dispose();
        });
    });
});

