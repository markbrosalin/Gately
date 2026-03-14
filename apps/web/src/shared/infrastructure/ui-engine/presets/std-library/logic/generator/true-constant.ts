import { buildStdLogicItemMarkup } from "../visual-factories";
import { buildStdLogicItem, buildStdPorts } from "../item-factories";

export const TRUE_CONSTANT_GENERATOR_ICON_PATH = `M-2 10.5 V-6.5 H-6 V-10.5 H3 V10.5 H-2 Z`;

export const TRUE_CONSTANT_GENERATOR_ITEM = buildStdLogicItem({
    group: "generator",
    refName: "true_constant",
    name: "True Constant",
    description: "Continuously outputs a constant logic 1 signal.",
    width: 32,
    height: 32,
    tags: ["generator", "constant"],
    ports: buildStdPorts({
        outputs: [{ id: "out-0", anchor: "right" }],
    }),
    visual: {
        base: {
            markup: [
                ...buildStdLogicItemMarkup({
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
                    stroke: "none",
                    fill: "var(--color-true)",
                    x: 4,
                    y: 4,
                    width: 28,
                    height: 28,
                    rx: 2,
                    ry: 2,
                },
                icon: {
                    d: TRUE_CONSTANT_GENERATOR_ICON_PATH,
                    stroke: "none",
                    fill: "var(--color-gray-1)",
                },
            },
        },
    },
});
