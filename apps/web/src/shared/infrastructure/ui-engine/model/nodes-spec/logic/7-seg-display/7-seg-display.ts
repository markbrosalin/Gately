import { BinaryVisualState, createVisualBinding } from "../../../visual";
import { createBaseNodeMarkup } from "../../base";
import { OFF_FILL, ON_FILL, SEGMENTS } from "./constant";
import { resolveSevenSegState } from "./resolver";
import { SEVEN_SEG_DISPLAY_PATH } from "./svg";

export const SEVEN_SEG_DISPLAY_VISUAL = createVisualBinding<BinaryVisualState>({
    hash: "7_SEG_DISPLAY",
    nodeName: "7-Segment Display",
    minWidth: 96,
    minHeight: 144,
    base: {
        markup: [
            ...createBaseNodeMarkup({
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
    resolveState: resolveSevenSegState,
});

