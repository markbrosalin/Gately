import type { Graph } from "@antv/x6";
import type { CinabonoClient } from "@cnbn/engine-worker";
import type { ArduinoHardwareController } from "@gately/features/arduino-hardware";
import type { UIEnginePublicApi } from "@gately/shared/infrastructure/ui-engine";
import type { WorkspaceSimulationMode, XYCoords } from "@gately/shared/types";
import type { Accessor } from "solid-js";

export type ContextTarget = "blank" | "node" | "edge";
export type AnchorReadySetter = (rect: XYCoords) => void;

export interface WorkspaceSimulationController {
    get isPaused(): boolean;
    get isBusy(): boolean;
    get mode(): WorkspaceSimulationMode;
    set mode(nextMode: WorkspaceSimulationMode);
    get isDisabled(): boolean;

    nextStep: () => void;
    requestNow: () => void;
    run: () => void;
    pause: () => void;
    resume: () => void;
    dispose: () => void;
}

export type WorkspaceContextMenuController = {
    menuOpen: Accessor<boolean>;
    menuTarget: Accessor<ContextTarget>;
    openContextMenuAt: (x: number, y: number, target: ContextTarget) => void;
    closeContextMenu: () => void;
    onOpenChange: (open: boolean) => void;
    setMenuTarget: (target: ContextTarget) => void;
    registerAnchorSetter: (setter: AnchorReadySetter) => void;
};

export type WorkspaceController = {
    contextMenu: WorkspaceContextMenuController;
    getSelectionCount: () => number;
    removeSelected: () => void;
    simulation: WorkspaceSimulationController;
    hardware: ArduinoHardwareController;
};

export type WorkspaceUIEngine = Pick<UIEnginePublicApi, "commands" | "debug" | "state"> & {
    debug: {
        graph: () => Graph | undefined;
    };
};

export type WorkspaceControllerDeps = {
    uiEngine: WorkspaceUIEngine;
    logicEngine: CinabonoClient;
    getActiveTabId: () => string | undefined;
};
