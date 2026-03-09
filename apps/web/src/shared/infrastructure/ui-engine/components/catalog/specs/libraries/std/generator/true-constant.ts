import { CatalogLogicItem } from "engine-model/catalog";
import { mkStdLogicItemMarkup } from "../factory";

export const TRUE_CONSTANT_GENERATOR_ICON_PATH = `M-2 10.5 V-6.5 H-6 V-10.5 H3 V10.5 H-2 Z`;

export const TRUE_CONSTANT_GENERATOR_ITEM: CatalogLogicItem = {
    ref: {
        libraryId: "std",
        path: ["generator"],
        itemName: "true_constant",
    },
    kind: "logic",
    meta: {
        name: "True Constant",
        description: "Continuously outputs a constant true signal.",
        tags: ["true", "const", "1", "generator"],
        createdAt: 0,
        extensions: {
            i18nKey: "catalog.std.generator.true_constant",
        },
    },
    layout: {
        width: 32,
        height: 32,
        minWidth: 32,
        minHeight: 32,
    },
    modules: [
        {
            type: "ports",
            config: {
                items: [{ id: "out-0", direction: "output", anchor: "right", order: 0 }],
            },
        },
        {
            type: "visual",
            config: {
                base: {
                    markup: [
                        ...mkStdLogicItemMarkup({
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
                            d: TRUE_CONSTANT_GENERATOR_ICON_PATH,
                            stroke: "none",
                            fill: "var(--color-gray-1)",
                        },
                    },
                },
            },
        },
    ],
};
