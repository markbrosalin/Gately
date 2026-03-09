import { LAMP_BODY, LAMP_GLOW } from "./svg";
import { CatalogLogicItem } from "engine-model/catalog";
import { mkStdLogicItemMarkup } from "../../factory";

export const LAMP_DISPLAY_ITEM: CatalogLogicItem = {
    ref: {
        libraryId: "std",
        path: ["display"],
        itemName: "lamp",
    },
    kind: "logic",
    meta: {
        name: "Lamp",
        description:
            "Displays the current input signal state, including 0, 1, unknown (X), and high-impedance (Hi-Z).",
        tags: ["display"],
        createdAt: 0,
        extensions: {
            i18nKey: "catalog.std.display.lamp",
        },
    },
    layout: {
        width: 32,
        height: 48,
        minWidth: 32,
        minHeight: 48,
    },
    modules: [
        {
            type: "ports",
            config: {
                items: [{ id: "in-0", direction: "input", anchor: "bottom", order: 0 }],
            },
        },
        {
            type: "visual",
            config: {
                base: {
                    markup: [
                        ...mkStdLogicItemMarkup({
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
            },
        },
    ],
};
