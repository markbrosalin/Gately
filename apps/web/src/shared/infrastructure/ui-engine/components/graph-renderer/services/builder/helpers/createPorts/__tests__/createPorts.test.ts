import type { CatalogLogicItem } from "engine-model/catalog";
import { describe, expect, it } from "vitest";
import { createPorts } from "../createPorts";

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

describe("createPorts", () => {
    it("returns empty port items when ports module is absent", () => {
        const result = createPorts(createLogicItem());

        expect(result.items).toEqual([]);
    });

    it("sorts ports by order and maps anchor-specific args", () => {
        const result = createPorts(
            createLogicItem({
                modules: [
                    {
                        type: "ports",
                        config: {
                            items: [
                                {
                                    id: "port-b",
                                    direction: "output",
                                    anchor: "bottom",
                                    order: 1,
                                    offset: 6,
                                    title: "B",
                                },
                                {
                                    id: "port-a",
                                    direction: "input",
                                    anchor: "top",
                                    order: 0,
                                    offset: -4,
                                    title: "A",
                                },
                            ],
                        },
                    },
                ],
            }),
        );

        expect(result.items).toMatchObject([
            {
                id: "port-a",
                group: "top",
                args: { dx: -4 },
            },
            {
                id: "port-b",
                group: "bottom",
                args: { dx: 6 },
            },
        ]);
    });
});
