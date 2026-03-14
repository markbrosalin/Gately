import { createConnectingConfig } from "../../../../graph-options";
import type { GraphRendererConnectingService } from "./types";

export const createGraphRendererConnectingService = (): GraphRendererConnectingService => {
    const buildConfig = () => createConnectingConfig("manhattan");

    return {
        buildConfig,
    };
};
