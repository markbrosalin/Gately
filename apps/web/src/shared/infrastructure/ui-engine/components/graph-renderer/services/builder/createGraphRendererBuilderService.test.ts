import { createBaseNodeMarkup, STROKE_WIDTH } from "engine-model";
import type { CatalogLogicItem } from "engine-model/catalog";
import {
    BUFFER_LOGIC_ICON_PATH,
    BUFFER_LOGIC_ITEM,
} from "engine-components/catalog/specs/std-library/logic/logic/buffer";
import { describe, expect, it, vi } from "vitest";
import { createGraphRendererBuilderApi } from "./createGraphRendererBuilderService";

vi.mock("../../../../services/node-visual/port-layout-registrator", () => ({
    useVisualPortLayoutRegistrator: () => ({
        registerPortLayouts: vi.fn(),
    }),
}));

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

describe("createGraphRendererBuilderService", () => {
    it("builds node props from a static catalog item", () => {
        const builder = createGraphRendererBuilderApi();

        const props = builder.buildNodeProps({
            item: BUFFER_LOGIC_ITEM,
            position: { x: 10, y: 20 },
        });

        expect(props).toMatchObject({
            x: 10,
            y: 20,
            width: BUFFER_LOGIC_ITEM.layout.width + STROKE_WIDTH,
            height: BUFFER_LOGIC_ITEM.layout.height + STROKE_WIDTH,
            data: {
                ref: BUFFER_LOGIC_ITEM.ref,
                refKey: "std::logic::buffer",
                kind: "logic",
            },
        });
        expect(props.attrs?.icon?.d).toBe(BUFFER_LOGIC_ICON_PATH);
        expect(
            (props.ports as { items: Array<{ id: string; group: string }> }).items,
        ).toMatchObject([
            { id: "in-0", group: "left" },
            { id: "out-0", group: "right" },
        ]);
    });

    it("applies custom visual markup and port mapping from catalog modules", () => {
        const builder = createGraphRendererBuilderApi();
        const item = createLogicItem({
            ref: {
                libraryId: "std",
                path: ["logic"],
                itemName: "custom-top-bottom",
            },
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
                            {
                                id: "port-b",
                                anchor: "bottom",
                                offset: 4,
                                title: "B",
                            },
                        ],
                    },
                },
                {
                    type: "visual",
                    config: {
                        base: {
                            markup: [{ tagName: "rect", selector: "custom-body" }],
                            attrs: {
                                body: {
                                    fill: "red",
                                },
                            },
                        },
                    },
                },
            ],
        });

        const props = builder.buildNodeProps({ item });
        const ports = (
            props.ports as { items: Array<{ id: string; group: string; args?: { dx?: number } }> }
        ).items;

        expect(props.markup).toEqual([{ tagName: "rect", selector: "custom-body" }]);
        expect(props.attrs?.body?.fill).toBe("red");
        expect(ports).toMatchObject([
            { id: "port-a", group: "top", args: { dy: 4 } },
            { id: "port-b", group: "bottom", args: { dy: 4 } },
        ]);
    });

    it("falls back to base node defaults when visual and ports modules are absent", () => {
        const builder = createGraphRendererBuilderApi();
        const item = createLogicItem({
            ref: {
                libraryId: "std",
                path: ["logic"],
                itemName: "plain",
            },
        });

        const props = builder.buildNodeProps({ item });

        expect(props.markup).toEqual(createBaseNodeMarkup());
        expect(props.attrs?.body?.width).toBe(64);
        expect((props.ports as { items: unknown[] }).items).toEqual([]);
    });
});
