import { createVisualBinding } from "../../visual";

export const XNOR_ICON_PATH = `
        M -12.948 11
        C -12.948 11 -9.008 7 -8.998 0
        C -8.998 -7 -12.998 -11 -12.998 -11

        M -8.948 11
        C -8.948 11 -5.008 7 -4.998 0
        C -4.998 -7 -8.998 -11 -8.998 -11

        M -8.948 11
        C 7.7888 11 9 -0.0005 9 -0.0005
        C 9 -0.0005 7.8737 -11 -9 -11

        M 14 0 A 2.5 2.5 0 1 1 9 0 A 2.5 2.5 0 1 1 14 0 
        M17 0 L14 0 

        M -6.5 -6
        L -16 -6

        M -6.5 6
        L -16 6`;

export const XNOR_VISUAL = createVisualBinding({
    hash: "XNOR",
    nodeName: "XNOR",
    minWidth: 64,
    minHeight: 48,
    base: {
        attrs: {
            icon: {
                d: XNOR_ICON_PATH,
            },
        },
    },
});

