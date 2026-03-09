import { CatalogLogicItem } from "engine-model/catalog";

export const NOR_LOGIC_ICON_PATH = `M 14 0 A 2.5 2.5 0 1 1 9 0 A 2.5 2.5 0 1 1 14 0 M17 0 L14 0 M -8.948 11 C -8.948 11 -5.008 7 -4.998 0 C -4.998 -7 -8.998 -11 -8.998 -11 M -8.948 11 C 7.7888 11 9 0 9 0 C 9 0 7.8737 -11 -9 -11 M -6.5 -6 L -16 -6 M -6.5 6 L -16 6`;

export const NOR_LOGIC_ITEM: CatalogLogicItem = {
    ref: {
        libraryId: "std",
        path: ["logic"],
        itemName: "nor",
    },
    kind: "logic",
    meta: {
        name: "NOR",
        description: "Outputs true only when all input signals are false.",
        tags: ["logic", "combinational"],
        extensions: {
            i18nKey: "catalog.std.logic.nor",
        },
        createdAt: 0,
    },
    layout: {
        width: 64,
        height: 48,
        minWidth: 64,
        minHeight: 48,
    },
    modules: [
        {
            type: "ports",
            config: {
                items: [
                    { id: "in-0", direction: "input", anchor: "left", order: 0, title: "A" },
                    { id: "in-1", direction: "input", anchor: "left", order: 1, title: "B" },
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
                            d: NOR_LOGIC_ICON_PATH,
                        },
                    },
                },
            },
        },
    ],
};
