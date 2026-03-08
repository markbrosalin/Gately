import { describe, expect, it } from "vitest";
import { createCatalogFactoryService } from "./createCatalogFactoryService";

describe("createCatalogFactoryService", () => {
    it("creates a library with normalized defaults", () => {
        const factory = createCatalogFactoryService();

        const library = factory.createLibrary({
            id: "std",
            name: "Standard",
        });

        expect(library).toEqual({
            formatVersion: 1,
            manifest: {
                id: "std",
                name: "Standard",
                version: "1.0.0",
                createdAt: expect.any(Number),
            },
            items: [],
        });
    });

    it("creates a logic item with normalized layout", () => {
        const factory = createCatalogFactoryService();

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
            ],
        });

        expect(item).toEqual({
            ref: {
                libraryId: "std",
                path: ["gates"],
                itemName: "AND",
            },
            kind: "logic",
            meta: {
                name: "AND",
                createdAt: expect.any(Number),
            },
            layout: {
                width: 120,
                height: 80,
            },
            modules: [
                {
                    type: "logic",
                    config: {
                        executor: "std.and",
                    },
                },
            ],
        });
    });

    it("normalizes missing composition boundary to empty arrays", () => {
        const factory = createCatalogFactoryService();

        const item = factory.createItem({
            ref: {
                libraryId: "std",
                path: ["circuits"],
                itemName: "RS-TRIGGER",
            },
            kind: "logic",
            name: "RS-TRIGGER",
            modules: [
                {
                    type: "composition",
                    config: {
                        contentJson: "",
                        items: [],
                        connections: [],
                        inputBindings: [],
                        outputBindings: [],
                    },
                } as never,
            ],
        });

        expect(item.kind).toBe("logic");
        expect(item.modules[0]).toMatchObject({
            type: "composition",
            config: {
                boundary: {
                    inputs: [],
                    outputs: [],
                },
            },
        });
    });
});
