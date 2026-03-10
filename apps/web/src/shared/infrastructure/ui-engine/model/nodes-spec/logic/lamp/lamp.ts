import { createVisualBinding, FullLogicState, resolveSingleInputState } from "../../../visual";
import { createBaseNodeMarkup } from "../../base";
import { LAMP_BODY, LAMP_GLOW } from "./svg";

export const LAMP_VISUAL = createVisualBinding<FullLogicState>({
    hash: "LAMP",
    nodeName: "Lamp",
    minWidth: 32,
    minHeight: 48,
    base: {
        markup: [
            ...createBaseNodeMarkup({
                beforeBody: [
                    {
                        tagName: "path",
                        selector: "lamp-body",
                    },
                ],
            }),
        ],
        attrs: {
            body: {
                class: "lamp-body",
                stroke: "none",
                fill: "none",
            },
            "lamp-body": {
                class: "lamp-body",
                d: LAMP_BODY,
                stroke: "none",
                fill: "var(--color-gray-11)",
                ref: "body",
                refX: "50%",
                refY: "50%",
            },
            icon: {
                class: "lamp-glow",
                d: LAMP_GLOW,
                stroke: "none",
                fill: "var(--color-gray-1)",
            },
        },
    },
    states: {
        on: {
            attrs: {
                icon: {
                    style: "fill: var(--color-true);",
                },
            },
        },
        off: {
            attrs: {
                icon: {
                    style: "fill: var(--color-false);",
                },
            },
        },
        error: {
            attrs: {
                icon: {
                    style: "fill: var(--color-x);",
                },
            },
        },
        "high-z": {
            attrs: {
                icon: {
                    style: "fill: var(--color-hiz);",
                },
            },
        },
    },
    resolveState: resolveSingleInputState,
});

