import { STROKE_WIDTH } from "@engine-model/constants";
import type { CatalogAnnotationItem, CatalogLogicItem } from "@engine-model/catalog";
import {
    BUFFER_LOGIC_ICON_PATH,
    BUFFER_LOGIC_ITEM,
} from "@engine-presets/std-library/logic/logic/buffer";
import { describe, expect, it } from "vitest";
import { createGraphRendererBuilderApi } from "./createGraphRendererBuilderService";

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

const createAnnotationItem = (
    overrides: Partial<CatalogAnnotationItem> = {},
): CatalogAnnotationItem => ({
    ref: {
        libraryId: "std",
        path: ["annotation"],
        itemName: "note",
    },
    kind: "annotation",
    meta: {
        name: "Annotation item",
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
            width: BUFFER_LOGIC_ITEM.layout.width,
            height: BUFFER_LOGIC_ITEM.layout.height,
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
            props.ports as { items: Array<{ id: string; group: string; args?: { dy?: number } }> }
        ).items;

        expect(props.markup).toEqual([{ tagName: "rect", selector: "custom-body" }]);
        expect(props.attrs?.body?.fill).toBe("red");
        expect(ports).toMatchObject([
            { id: "port-a", group: "top", args: { dy: 4 } },
            { id: "port-b", group: "bottom", args: { dy: 4 } },
        ]);
    });

    it("falls back to the base logic shell when visual and ports modules are absent", () => {
        const builder = createGraphRendererBuilderApi();
        const item = createLogicItem({
            ref: {
                libraryId: "std",
                path: ["logic"],
                itemName: "plain",
            },
        });

        const props = builder.buildNodeProps({ item });

        expect(props.markup).toEqual([
            {
                tagName: "g",
                className: "base-node",
                children: [
                    { tagName: "rect", selector: "body" },
                    { tagName: "path", selector: "icon" },
                ],
            },
        ]);
        expect(props.attrs?.body?.width).toBe(64 - STROKE_WIDTH);
        expect(props.attrs?.body?.height).toBe(32 - STROKE_WIDTH);
        expect((props.ports as { items: unknown[] }).items).toEqual([]);
    });

    it("throws a clear builder error for unsupported item kinds", () => {
        const builder = createGraphRendererBuilderApi();

        expect(() => builder.buildNodeProps({ item: createAnnotationItem() })).toThrow(
            'Graph renderer builder strategy for item kind "annotation" is not implemented.',
        );
    });
});


