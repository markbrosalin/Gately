import { createEffect } from "solid-js";
import type { EnginePlugin } from "../types";

export const createSyncActiveWorkspaceScenePlugin = (): EnginePlugin => {
    return {
        name: "syncActiveWorkspaceScene",
        install: ({ components }) => {
            const { graphRenderer, workspace, graphDocument } = components;

            createEffect(() => {
                const workspaceId = workspace.query.activeWorkspaceId();
                const graph = graphRenderer.query.graph();

                if (!graph) return;

                if (!workspaceId) {
                    graphRenderer.clearScene();
                    return;
                }

                const document = graphDocument.query.getDocument(workspaceId);
                if (!document) {
                    return;
                }

                if (graphRenderer.query.activeWorkspaceId() === workspaceId) {
                    return;
                }

                graphRenderer.loadDocument({ document });
            });
        },
    };
};
