import { createVisualBinding } from "../../visual";

export const NAND_ICON_PATH = `
        M 14 0 A 2.5 2.5 0 1 1 9 0 A 2.5 2.5 0 1 1 14 0 
        M17 0 L14 0 

        M -1.7 -11
        C 4.3 -11 9 -6 9 0
        C 9 6 4 11 -2 11
        H -7
        C -8 11 -8 10.6 -8 10
        V -10
        C -8 -10.6 -7.6 -11 -7 -11
        H -2

        M -8 -6
        L -16 -6

        M -9 6
        L -16 6
        `;

export const NAND_VISUAL = createVisualBinding({
    hash: "NAND",
    nodeName: "NAND",
    minWidth: 64,
    minHeight: 48,
    base: {
        attrs: {
            icon: {
                d: NAND_ICON_PATH,
            },
        },
    },
});

