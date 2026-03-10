import { createVisualBinding } from "../../visual";

export const BUFFER_ICON_PATH = `M-16 0 L-8 0 M9 0 L17 0
            M8.598 -0.805
            C9.245 -0.416 9.245 0.523 8.598 0.911
            L-6.485 9.961
            C-7.152 10.361 -8 9.881 -8 9.104
            L-8 -8.997
            C-8 -9.774 -7.152 -10.254 -6.485 -9.854
            L8.598 -0.805 Z`;

export const BUFFER_VISUAL = createVisualBinding({
    hash: "BUFFER",
    nodeName: "Buffer",
    minWidth: 64,
    minHeight: 32,
    base: {
        attrs: {
            icon: {
                d: BUFFER_ICON_PATH,
            },
        },
    },
});

