import { buildStdLogicItemMarkup } from "../visual-factories";
import { buildStdLogicItem, buildStdPorts } from "../item-factories";

export const TOGGLE_GENERATOR_ICON_PATH =
    "M0 9C5 9 9 5 9 0C9 -2.8 7.7 -5.3 5.7 -6.9L5.1 -3.1C5.7 -2.2 6 -1.1 6 0C6 3.4 3.3 6 0 6C-3.3 6 -6 3.4 -6 0C-6 -1.1 -5.7 -2.2 -5.1 -3.1L-5.7 -6.9C-7.7 -5.3 -9 -2.8 -9 0C-9 5 -5 9 0 9Z" +
    "M0 -1C1.8 -1 3.1 -2.3 3.3 -3.4L5.1 -17C5.1 -17.3 5.2 -17.7 5.2 -18.1C5.2 -20.8 2.9 -23 0 -23C-2.9 -23 -5.2 -20.8 -5.2 -18.1C-5.2 -17.7 -5.1 -17.2 -5.1 -17L-3.3 -3.4C-3.2 -2.3 -1.8 -1 0 -1Z";

const TOGGLE_GENERATOR_OUTLINE_PATH = `M 0 0 C -3.4 0 -6.2 -2.6 -6 -5.7 V -8.1 L 6 -8.1 V -5.7 C 6.1 -2.6 3.4 0 0 0 Z`;

export const TOGGLE_GENERATOR_ITEM = buildStdLogicItem({
    group: "generator",
    refName: "toggle",
    name: "Toggle",
    description: "Switches its output state between 0 and 1 each time it is toggled.",
    width: 32,
    height: 32,
    tags: ["generator"],
    ports: buildStdPorts({
        outputs: [{ id: "out-0", anchor: "right" }],
    }),
    visual: {
        base: {
            markup: [
                ...buildStdLogicItemMarkup({
                    beforeIcon: [
                        {
                            tagName: "path",
                            selector: "toggle-on-outline",
                        },
                        {
                            tagName: "rect",
                            selector: "plate",
                        },
                    ],
                    afterIcon: [
                        {
                            tagName: "ellipse",
                            selector: "toggle-glare",
                        },
                    ],
                }),
            ],
            attrs: {
                body: {
                    class: "toggle-body",
                    fill: "var(--color-gray-1)",
                },
                plate: {
                    x: 4,
                    y: 4,
                    width: 26,
                    height: 26,
                    rx: 2,
                    ry: 2,
                },
                icon: {
                    d: TOGGLE_GENERATOR_ICON_PATH,
                    stroke: "none",
                },
                "toggle-glare": {
                    cx: 0,
                    rx: 3,
                    ry: 2.5,
                    ref: "body",
                    refX: "50%",
                    refY: "50%",
                },
                "toggle-on-outline": {
                    fill: "none",
                    "stroke-width": 2,
                    ref: "body",
                    refX: "50%",
                    refY: "50%",
                },
            },
        },
        states: {
            on: {
                attrs: {
                    plate: {
                        fill: "var(--color-true)",
                    },
                    icon: {
                        fill: "var(--color-gray-1)",
                        transform: "rotate(180, 0 0)",
                    },
                    "toggle-glare": {
                        fill: "var(--color-true)",
                        cy: 18.5,
                    },
                    "toggle-on-outline": {
                        stroke: "var(--color-gray-11)",
                        transform: "translate(0, 24)",
                        d: TOGGLE_GENERATOR_OUTLINE_PATH,
                    },
                },
            },
            off: {
                attrs: {
                    plate: {
                        fill: "var(--color-gray-1)",
                    },
                    icon: {
                        fill: "var(--color-gray-11)",
                        transform: "rotate(0, 0 0)",
                    },
                    "toggle-glare": {
                        fill: "var(--color-gray-1)",
                        cy: -18.5,
                    },
                    "toggle-on-outline": {
                        stroke: "var(--color-gray-1)",
                        transform: "translate(0, -24), rotate(180, 0 0)",
                        d: TOGGLE_GENERATOR_OUTLINE_PATH,
                    },
                },
            },
        },
    },
});

