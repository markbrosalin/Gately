import { createItemSelectionPlugin } from "./item-selection";
import type { GraphRendererPluginContext } from "./types";

export const buildGraphRendererPlugins = (ctx: GraphRendererPluginContext) => {
    return [createItemSelectionPlugin()].forEach((plugin) => plugin.install(ctx));
};
