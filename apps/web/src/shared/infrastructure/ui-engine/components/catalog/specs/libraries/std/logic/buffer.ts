import { CatalogLogicItem } from "engine-model/catalog";

export const BUFFER_LOGIC_ICON_PATH = `M-16 0 L-8 0 M9 0 L17 0 M8.598 -0.805 C9.245 -0.416 9.245 0.523 8.598 0.911L-6.485 9.961 C-7.152 10.361 -8 9.881 -8 9.104 L-8 -8.997 C-8 -9.774 -7.152 -10.254 -6.485 -9.854 L8.598 -0.805 Z`;

export const BUFFER_LOGIC_ITEM: CatalogLogicItem = {
    ref: {
        libraryId: "std",
        path: ["logic"],
        itemName: "buffer",
    },
    kind: "logic",
    meta: {
        name: "Buffer",
        description: "Passes the input signal to the output without changing it.",
        tags: ["logic", "combinational"],
        createdAt: 0,
        extensions: {
            i18nKey: "catalog.std.logic.buffer",
        },
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
                            d: BUFFER_LOGIC_ICON_PATH,
                        },
                    },
                },
            },
        },
    ],
};
