import { LAMP_BODY, LAMP_GLOW } from "./svg";
import { buildStdLogicItem, buildStdPorts } from "../../item-factories";
import { buildStdLogicItemMarkup } from "../../visual-factories";

export const LAMP_DISPLAY_ITEM = buildStdLogicItem({
    group: "display",
    refName: "lamp",
    name: "Lamp",
    description:
        "Displays the current input signal state, including 0, 1, unknown (X), and high-impedance (Hi-Z).",
    width: 32,
    height: 48,
    tags: ["display"],
    ports: buildStdPorts({
        inputs: [{ id: "in-0", anchor: "bottom" }],
    }),
    visual: {
        base: {
            markup: [
                ...buildStdLogicItemMarkup({
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
            on: { attrs: { icon: { style: "fill: var(--color-true);" } } },
            off: { attrs: { icon: { style: "fill: var(--color-false);" } } },
            error: { attrs: { icon: { style: "fill: var(--color-x);" } } },
            "high-z": { attrs: { icon: { style: "fill: var(--color-hiz);" } } },
        },
    },
});
