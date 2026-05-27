import { createRoot, onCleanup } from "solid-js";
import type { EnginePlugin, EnginePluginContext } from "./types";

export const installEnginePlugins = (
    plugins: EnginePlugin[],
    ctx: EnginePluginContext,
): (() => void) => {
    return createRoot((dispose) => {
        const pluginDisposers = plugins
            .map((plugin) => plugin.install(ctx))
            .filter((disposer): disposer is () => void => typeof disposer === "function");

        onCleanup(() => {
            pluginDisposers.forEach((disposePlugin) => disposePlugin());
        });

        return dispose;
    });
};
