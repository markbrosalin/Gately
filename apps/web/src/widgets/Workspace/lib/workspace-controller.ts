import { createEffect, createSignal, onCleanup } from "solid-js";
import { attachWorkspaceBridge } from "./bridge";
import { attachWorkspaceGraphInteractions } from "./graph-interactions";
import { useWorkspaceContextMenu } from "./context-menu";
import { createWorkspaceSimulation } from "./simulation";
import type { WorkspaceController, WorkspaceControllerDeps } from "./types";

export const useWorkspaceController = (deps: WorkspaceControllerDeps): WorkspaceController => {
    const [selectionVersion, setSelectionVersion] = createSignal(0);
    const contextMenu = useWorkspaceContextMenu();
    const simulation = createWorkspaceSimulation({
        logicEngine: deps.logicEngine,
        uiEngine: deps.uiEngine,
        getActiveTabId: deps.getActiveTabId,
    });

    const getSelectionCount = () => {
        selectionVersion();
        return deps.uiEngine.debug.graph()?.getSelectedCellCount?.() ?? 0;
    };

    const removeSelected = () => {
        const graph = deps.uiEngine.debug.graph();
        if (!graph?.getSelectedCells) return;
        const selected = graph.getSelectedCells();
        if (!selected.length) return;
        graph.removeCells(selected);
    };

    createEffect(() => {
        const graph = deps.uiEngine.debug.graph();
        if (!graph) return;

        const dispose = attachWorkspaceBridge({
            graph,
            uiEngine: deps.uiEngine,
            logicEngine: deps.logicEngine,
            getActiveTabId: deps.getActiveTabId,
            requestSimulationNow: simulation.requestNow,
        });

        onCleanup(dispose);
    });

    createEffect(() => {
        const graph = deps.uiEngine.debug.graph();
        if (!graph) return;

        const dispose = attachWorkspaceGraphInteractions({
            graph,
            bumpSelection: () => setSelectionVersion((v) => v + 1),
            openContextMenuAt: contextMenu.openContextMenuAt,
            closeContextMenu: contextMenu.closeContextMenu,
            setMenuTarget: (target) => contextMenu.setMenuTarget(target),
        });

        onCleanup(dispose);
    });

    onCleanup(simulation.dispose);

    return {
        contextMenu,
        getSelectionCount,
        removeSelected,
        simulation,
    };
};

