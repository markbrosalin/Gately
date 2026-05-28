import { useUIEngine } from "@gately/shared/infrastructure";
import { useLogicEngine } from "@gately/shared/infrastructure/LogicEngine";
import { Component, Show } from "solid-js";
import { useWorkspaceController } from "../lib";
import { WorkspaceContextMenu } from "./WorkspaceContextMenu";
import { WorkspaceToolbar } from "./WorkspaceToolbar";

export const InnerWorkspace: Component = () => {
    const uiEngine = useUIEngine();
    const logicEngine = useLogicEngine();
    const controller = useWorkspaceController({
        uiEngine,
        logicEngine,
        getActiveTabId: uiEngine.state.activeTabId,
    });

    return (
        <div class="w-full h-full relative">
            <WorkspaceToolbar hardware={controller.hardware} simulation={controller.simulation} />
            <Show when={uiEngine.state.activeTabId()} fallback={<p>Create a new tab</p>}>
                <div ref={uiEngine.mount.setContainer} class="w-full h-full"></div>
                <WorkspaceContextMenu
                    contextMenu={controller.contextMenu}
                    getSelectionCount={controller.getSelectionCount}
                    removeSelected={controller.removeSelected}
                />
            </Show>
        </div>
    );
};

export const Workspace: Component = () => {
    return <InnerWorkspace />;
};
