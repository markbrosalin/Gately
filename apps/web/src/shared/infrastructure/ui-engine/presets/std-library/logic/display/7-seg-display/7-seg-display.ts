import { SEVEN_SEG_DISPLAY_PATH } from "./svg";
import { OFF_FILL, ON_FILL, SEGMENTS } from "./constant";
import { buildStdLogicItem, buildStdPorts } from "../../item-factories";
import { buildStdLogicItemMarkup } from "../../visual-factories";

export const SEVEN_SEG_DISPLAY_ITEM = buildStdLogicItem({
    group: "display",
    refName: "seven_seg_display",
    name: "7-Segment Display",
    description:
        "Displays numeric and symbolic patterns from segment inputs a-g and decimal point input dp.",
    width: 96,
    height: 144,
    tags: ["display"],
    ports: buildStdPorts({
        inputs: [
            { id: "in-0", anchor: "left", title: "a" },
            { id: "in-1", anchor: "left", title: "b" },
            { id: "in-2", anchor: "left", title: "c" },
            { id: "in-3", anchor: "left", title: "d" },
            { id: "in-4", anchor: "left", title: "e" },
            { id: "in-5", anchor: "left", title: "f" },
            { id: "in-6", anchor: "left", title: "g" },
            { id: "in-7", anchor: "left", title: "dp" },
        ],
    }),
    visual: {
        base: {
            markup: [
                ...buildStdLogicItemMarkup({
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
                on: { attrs: { fill: ON_FILL } },
                off: { attrs: { fill: OFF_FILL } },
            },
        },
    },
});

