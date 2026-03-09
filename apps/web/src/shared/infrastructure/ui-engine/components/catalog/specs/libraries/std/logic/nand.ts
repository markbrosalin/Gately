import { CatalogLogicItem } from "engine-model/catalog";

export const NAND_LOGIC_ICON_PATH = `M 14 0 A 2.5 2.5 0 1 1 9 0 A 2.5 2.5 0 1 1 14 0 M17 0 L14 0 M -1.7 -11 C 4.3 -11 9 -6 9 0 C 9 6 4 11 -2 11 H -7 C -8 11 -8 10.6 -8 10 V -10 C -8 -10.6 -7.6 -11 -7 -11 H -2 M -8 -6 L -16 -6 M -9 6 L -16 6`;

export const NAND_LOGIC_ITEM: CatalogLogicItem = {
    ref: {
        libraryId: "std",
        path: ["logic"],
        itemName: "nand",
    },
    kind: "logic",
    meta: {
        name: "NAND",
        description: "Outputs false only when all input signals are true.",
        tags: ["logic", "combinational"],
        extensions: {
            i18nKey: "catalog.std.logic.nand",
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
                            d: NAND_LOGIC_ICON_PATH,
                        },
                    },
                },
            },
        },
    ],
};
