import { createVisualBinding } from "../../visual";
import { createBaseNodeMarkup } from "../base";

export const TRUE_CONSTANT_ICON_PATH = `M-2 10.5 V-6.5 H-6 V-10.5 H3 V10.5 H-2 Z`;

export const TRUE_CONSTANT_VISUAL = createVisualBinding({
    hash: "TRUE_CONSTANT",
    nodeName: "True Constant",
    minWidth: 32,
    minHeight: 32,
    base: {
        markup: [
            ...createBaseNodeMarkup({
                beforeIcon: [
                    {
                        tagName: "rect",
                        selector: "plate",
                    },
                ],
            }),
        ],
        attrs: {
            body: {
                class: "true_constant-body",
                fill: "var(--color-gray-1)",
            },
            plate: {
                fill: "var(--color-true)",
                x: 4,
                y: 4,
                width: 26,
                height: 26,
                rx: 2,
                ry: 2,
            },
            icon: {
                d: TRUE_CONSTANT_ICON_PATH,
                stroke: "none",
                fill: "var(--color-gray-1)",
            },
        },
    },
});

