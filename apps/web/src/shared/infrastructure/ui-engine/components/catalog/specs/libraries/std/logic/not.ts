import { CatalogLogicItem } from "engine-model/catalog";

export const NOT_LOGIC_ICON_PATH = `M 14 0 A 2.5 2.5 0 1 1 9 0 A 2.5 2.5 0 1 1 14 0 M17 0 L14 0 M-16 0 L-8 0 M8.598 -0.805 C9.245 -0.416 9.245 0.523 8.598 0.911 L-6.485 9.961 C-7.152 10.361 -8 9.881 -8 9.104 L-8 -8.997 C-8 -9.774 -7.152 -10.254 -6.485 -9.854 L8.598 -0.805 Z`;

export const NOT_LOGIC_ITEM: CatalogLogicItem = {
    ref: {
        libraryId: "std",
        path: ["logic"],
        itemName: "not",
    },
    kind: "logic",
    meta: {
        name: "Not",
        description: "Inverts the input signal.",
        tags: ["logic", "combinational"],
        extensions: {
            i18nKey: "catalog.std.logic.not",
        },
        createdAt: 0,
    },
    layout: {
        width: 64,
        height: 32,
        minWidth: 64,
        minHeight: 32,
    },
    modules: [
        {
            type: "ports",
            config: {
                items: [
                    { id: "in-0", direction: "input", anchor: "left", order: 0, title: "A" },
                    { id: "out-0", direction: "output", anchor: "right", order: 0, title: "X" },
                ],
            },
        },
        {
            type: "visual",
            config: {
                base: {
                    attrs: {
                        icon: {
                            d: NOT_LOGIC_ICON_PATH,
                        },
                    },
                },
            },
        },
    ],
};
