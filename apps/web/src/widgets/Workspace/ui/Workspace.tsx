import { useUIEngine } from "@gately/shared/infrastructure";
import { useLogicEngine } from "@gately/shared/infrastructure/LogicEngine";
import { Component, Show } from "solid-js";
import { useWorkspaceController } from "../lib";
import { WorkspaceToolbar } from "./WorkspaceToolbar";

export const InnerWorkspace: Component = () => {
    const uiEngine = useUIEngine();
    const logicEngine = useLogicEngine();
    const controller = useWorkspaceController({
        uiEngine,
        logicEngine,
        getActiveTabId: uiEngine.query.workspace.activeTabId,
    });
    const setGraphContainer = (container: HTMLDivElement) => {
        requestAnimationFrame(() => {
            if (!container.isConnected) {
                return;
            }

            uiEngine.mount(container);
        });
    };

    return (
        <div class="w-full h-full min-h-0 relative">
            <WorkspaceToolbar simulation={controller.simulation} />
            <Show when={uiEngine.query.workspace.activeTabId()} fallback={<p>Create a new tab</p>}>
                <div ref={setGraphContainer} class="w-full h-full"></div>
                {/* <WorkspaceContextMenu
                    contextMenu={controller.contextMenu}
                    // getSelectionCount={controller.getSelectionCount}
                    // removeSelected={controller.removeSelected}
                /> */}
            </Show>
        </div>
    );
};

export const Workspace: Component = () => {
    return <InnerWorkspace />;
};
