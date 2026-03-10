import { createVisualBinding } from "../../visual";

export const FALSE_CONSTANT_ICON_PATH =
    "M0 11C-1.7 11 -3.3 10.6 -4.6 9.7C-6 8.9 -7 7.6 -7.8 6C-8.6 4.3 -9 2.3 -9 0C-9 -2.3 -8.6 -4.3 -7.8 -6C-7 -7.6 -6 -8.8 -4.6 -9.7C-3.3 -10.6 -1.7 -11 0 -11C1.7 -11 3.3 -10.6 4.6 -9.7C6 -8.8 7.1 -7.6 7.8 -6C8.6 -4.3 9 -2.3 9 0C9 2.3 8.6 4.3 7.8 6C7.1 7.6 6 8.9 4.6 9.7C3.3 10.6 1.7 11 0 11ZM0 6.8C0.8 6.8 1.5 6.6 2.1 6.1C2.8 5.7 3.5 4.9 3.8 3.9C4.2 2.9 4.5 1.6 4.5 0C4.5 -1.6 4.2 -2.9 3.8 -3.9C3.5 -4.9 2.8 -5.7 2.1 -6.1C1.5 -6.6 0.8 -6.8 0 -6.8C-0.8 -6.8 -1.5 -6.6 -2.1 -6.1C-2.7 -5.7 -3.4 -4.9 -3.8 -3.9C-4.1 -2.9 -4.5 -1.6 -4.5 0C-4.5 1.6 -4.1 2.9 -3.8 3.9C-3.4 4.9 -2.7 5.7 -2.1 6.1C-1.5 6.6 -0.8 6.8 0 6.8Z";

export const FALSE_CONSTANT_VISUAL = createVisualBinding({
    hash: "FALSE_CONSTANT",
    nodeName: "False Constant",
    minWidth: 32,
    minHeight: 32,
    base: {
        attrs: {
            icon: {
                d: FALSE_CONSTANT_ICON_PATH,
                fill: "var(--color-black)",
                stroke: "none",
            },
        },
    },
});

