import { CatalogLogicItem } from "engine-model/catalog";

export const AND_LOGIC_ICON_PATH = `M -1.7 -11 C 4.3 -11 9 -6 9 0 C 9 6 4 11 -2 11 H -7 C -8 11 -8 10.6 -8 10 V -10 C -8 -10.6 -7.6 -11 -7 -11 H -2 M -8 -6 L -16 -6 M -9 6 L -16 6 M 17 0 L 9 0`;

export const AND_LOGIC_ITEM: CatalogLogicItem = {
    ref: {
        libraryId: "std",
        path: ["logic"],
        itemName: "and",
    },
    kind: "logic",
    meta: {
        name: "AND",
        description: "Outputs true only when all input signals are true.",
        tags: ["logic", "combinational"],
        extensions: {
            i18nKey: "catalog.std.logic.and",
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
                            d: AND_LOGIC_ICON_PATH,
                        },
                    },
                },
            },
        },
    ],
};
