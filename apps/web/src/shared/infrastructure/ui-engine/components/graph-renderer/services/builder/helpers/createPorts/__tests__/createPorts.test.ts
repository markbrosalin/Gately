import type { CatalogLogicItem } from "@engine-model/catalog";
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

    it("keeps input and output order and maps anchor-specific args", () => {
        const result = createPorts(
            createLogicItem({
                modules: [
                    {
                        type: "ports",
                        config: {
                            inputs: [
                                {
                                    id: "port-a",
                                    anchor: "top",
                                    offset: -4,
                                    title: "A",
                                },
                            ],
                            outputs: [
                                {
                                    id: "port-b",
                                    anchor: "bottom",
                                    offset: 6,
                                    title: "B",
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
                args: { dy: 4 },
            },
            {
                id: "port-b",
                group: "bottom",
                args: { dy: 6 },
            },
        ]);
    });
});
