import { CatalogLogicItem } from "engine-model/catalog";

export const XNOR_LOGIC_ICON_PATH = ` M -12.948 11 C -12.948 11 -9.008 7 -8.998 0 C -8.998 -7 -12.998 -11 -12.998 -11 M -8.948 11 C -8.948 11 -5.008 7 -4.998 0 C -4.998 -7 -8.998 -11 -8.998 -11 M -8.948 11 C 7.7888 11 9 -0.0005 9 -0.0005 C 9 -0.0005 7.8737 -11 -9 -11 M 14 0 A 2.5 2.5 0 1 1 9 0 A 2.5 2.5 0 1 1 14 0 M17 0 L14 0 M -6.5 -6 L -16 -6 M -6.5 6 L -16 6`;

export const XNOR_LOGIC_ITEM: CatalogLogicItem = {
    ref: {
        libraryId: "std",
        path: ["logic"],
        itemName: "xnor",
    },
    kind: "logic",
    meta: {
        name: "XNOR",
        description: "Outputs true when the inputs are equal.",
        tags: ["logic", "combinational"],
        extensions: {
            i18nKey: "catalog.std.logic.xnor",
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
                            d: XNOR_LOGIC_ICON_PATH,
                        },
                    },
                },
            },
        },
    ],
};
