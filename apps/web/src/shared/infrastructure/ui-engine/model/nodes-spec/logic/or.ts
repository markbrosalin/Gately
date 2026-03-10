import { createVisualBinding } from "../../visual";

export const OR_ICON_PATH = `
        M -8.948 11
        C -8.948 11 -5.008 7 -4.998 0
        C -4.998 -7 -8.998 -11 -8.998 -11

        M -8.948 11
        C 7.7888 11 9 -0.0005 9 -0.0005
        C 9 -0.0005 7.8737 -11 -9 -11

        M 17 0
        L 9 0

        M -6.5 -6
        L -16 -6

        M -6.5 6
        L -16 6`;

export const OR_VISUAL = createVisualBinding({
    hash: "OR",
    nodeName: "OR",
    minWidth: 64,
    minHeight: 48,
    base: {
        attrs: {
            icon: {
                d: OR_ICON_PATH,
            },
        },
    },
});

