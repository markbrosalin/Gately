import { createSyncActiveWorkspaceScenePlugin } from "./syncActiveWorkspaceScene";
import type { EnginePlugin } from "./types";

export const buildEnginePlugins = (): EnginePlugin[] => {
    return [createSyncActiveWorkspaceScenePlugin()];
};
