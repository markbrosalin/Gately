import { useWorkspaceContextMenu } from "./context-menu";
import { createWorkspaceSimulation } from "./simulation";
import type { WorkspaceController, WorkspaceControllerDeps } from "./types";

export const useWorkspaceController = (deps: WorkspaceControllerDeps): WorkspaceController => {
    const contextMenu = useWorkspaceContextMenu();
    const simulation = createWorkspaceSimulation({
        logicEngine: deps.logicEngine,
        uiEngine: deps.uiEngine,
        getActiveTabId: deps.getActiveTabId,
    });

    // createEffect(() => {
    //     const graph = deps.uiEngine.debug.graph();
    //     if (!graph) return;

    //     const dispose = attachWorkspaceGraphInteractions({
    //         graph,
    //         bumpSelection: () => setSelectionVersion((v) => v + 1),
    //         openContextMenuAt: contextMenu.openContextMenuAt,
    //         closeContextMenu: contextMenu.closeContextMenu,
    //         setMenuTarget: (target) => contextMenu.setMenuTarget(target),
    //     });

    //     onCleanup(dispose);
    // });

    // onCleanup(simulation.dispose);

    return {
        contextMenu,
        simulation,
    };
};
