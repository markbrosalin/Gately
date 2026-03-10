import { createVisualBinding } from "../../visual";

export const NOT_ICON_PATH = `M 14 0 A 2.5 2.5 0 1 1 9 0 A 2.5 2.5 0 1 1 14 0 
            M17 0 L14 0 
            M-16 0 L-8 0 
            M8.598 -0.805
            C9.245 -0.416 9.245 0.523 8.598 0.911
            L-6.485 9.961
            C-7.152 10.361 -8 9.881 -8 9.104
            L-8 -8.997
            C-8 -9.774 -7.152 -10.254 -6.485 -9.854
            L8.598 -0.805 Z`;

export const NOT_VISUAL = createVisualBinding({
    hash: "NOT",
    nodeName: "NOT",
    minWidth: 64,
    minHeight: 32,
    base: {
        attrs: {
            icon: {
                d: NOT_ICON_PATH,
            },
        },
    },
});

