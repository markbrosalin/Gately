import type { GraphRendererPlugin } from "../types";

export const createItemSelectionPlugin = (): GraphRendererPlugin => {
    return {
        name: "item-selection",
        install: (ctx) => {
            const instance = ctx.getService("instance");

            instance.onGraphMount(() => undefined);
            instance.onGraphUnmount(() => undefined);
        },
    };
};
