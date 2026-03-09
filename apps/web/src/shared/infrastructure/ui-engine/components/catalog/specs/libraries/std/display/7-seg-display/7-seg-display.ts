import { CatalogLogicItem } from "engine-model/catalog";
import { mkStdLogicItemMarkup } from "../../factory";
import { SEVEN_SEG_DISPLAY_PATH } from "./svg";
import { OFF_FILL, ON_FILL, SEGMENTS } from "./constant";

export const SEVEN_SEG_DISPLAY_ITEM: CatalogLogicItem = {
    ref: {
        libraryId: "std",
        path: ["display"],
        itemName: "seven_seg_display",
    },
    kind: "logic",
    meta: {
        name: "7-Segment Display",
        description:
            "Displays numeric and symbolic patterns from segment inputs a-g and decimal point input dp.",
        tags: ["display"],
        createdAt: 0,
        extensions: {
            i18nKey: "catalog.std.display.seven_seg_display",
        },
    },
    layout: {
        width: 96,
        height: 144,
        minWidth: 96,
        minHeight: 144,
    },
    modules: [
        {
            type: "ports",
            config: {
                items: [
                    { id: "in-0", direction: "input", anchor: "left", order: 0, title: "a" },
                    { id: "in-1", direction: "input", anchor: "left", order: 1, title: "b" },
                    { id: "in-2", direction: "input", anchor: "left", order: 2, title: "c" },
                    { id: "in-3", direction: "input", anchor: "left", order: 3, title: "d" },
                    { id: "in-4", direction: "input", anchor: "left", order: 4, title: "e" },
                    { id: "in-5", direction: "input", anchor: "left", order: 5, title: "f" },
                    { id: "in-6", direction: "input", anchor: "left", order: 6, title: "g" },
                    { id: "in-7", direction: "input", anchor: "left", order: 7, title: "dp" },
                ],
            },
        },
        {
            type: "visual",
            config: {
                base: {
                    markup: [
                        ...mkStdLogicItemMarkup({
                            afterIcon: [
                                { tagName: "path", selector: "a" },
                                { tagName: "path", selector: "b" },
                                { tagName: "path", selector: "c" },
                                { tagName: "path", selector: "d" },
                                { tagName: "path", selector: "e" },
                                { tagName: "path", selector: "f" },
                                { tagName: "path", selector: "g" },
                                { tagName: "path", selector: "dot" },
                            ],
                        }),
                    ],
                    attrs: {
                        body: {
                            class: "seven-seg-display-body",
                            fill: "var(--color-black)",
                        },
                        a: {
                            class: "a-segment",
                            d: SEVEN_SEG_DISPLAY_PATH.a,
                            fill: OFF_FILL,
                        },
                        b: {
                            class: "b-segment",
                            d: SEVEN_SEG_DISPLAY_PATH.b,
                            fill: OFF_FILL,
                        },
                        c: {
                            class: "c-segment",
                            d: SEVEN_SEG_DISPLAY_PATH.c,
                            fill: OFF_FILL,
                        },
                        d: {
                            class: "d-segment",
                            d: SEVEN_SEG_DISPLAY_PATH.d,
                            fill: OFF_FILL,
                        },
                        e: {
                            class: "e-segment",
                            d: SEVEN_SEG_DISPLAY_PATH.e,
                            fill: OFF_FILL,
                        },
                        f: {
                            class: "f-segment",
                            d: SEVEN_SEG_DISPLAY_PATH.f,
                            fill: OFF_FILL,
                        },
                        g: {
                            class: "g-segment",
                            d: SEVEN_SEG_DISPLAY_PATH.g,
                            fill: OFF_FILL,
                        },
                        dot: {
                            class: "dot-segment",
                            d: SEVEN_SEG_DISPLAY_PATH.dot,
                            fill: OFF_FILL,
                        },
                    },
                },
                indexedStates: {
                    targets: SEGMENTS.map(([segment]) => segment),
                    states: {
                        on: {
                            attrs: {
                                fill: ON_FILL,
                            },
                        },
                        off: {
                            attrs: {
                                fill: OFF_FILL,
                            },
                        },
                    },
                },
            },
        },
    ],
};
