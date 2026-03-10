import type { SimulationBatchAppliedEvent } from "./simulation";
import { SIMULATION_BATCH_APPLIED_EVENT } from "./simulation";
import type {
    WorkspaceNavigationChangedEvent,
    WorkspaceTabClosedEvent,
    WorkspaceTabCreatedEvent,
    WorkspaceTabOpenedEvent,
} from "./workspace";
import {
    WORKSPACE_NAVIGATION_CHANGED_EVENT,
    WORKSPACE_TAB_CLOSED_EVENT,
    WORKSPACE_TAB_CREATED_EVENT,
    WORKSPACE_TAB_OPENED_EVENT,
} from "./workspace";

export type UIEngineEventMap = {
    [SIMULATION_BATCH_APPLIED_EVENT]: SimulationBatchAppliedEvent;
    [WORKSPACE_TAB_CREATED_EVENT]: WorkspaceTabCreatedEvent;
    [WORKSPACE_TAB_OPENED_EVENT]: WorkspaceTabOpenedEvent;
    [WORKSPACE_TAB_CLOSED_EVENT]: WorkspaceTabClosedEvent;
    [WORKSPACE_NAVIGATION_CHANGED_EVENT]: WorkspaceNavigationChangedEvent;
};

export type UIEngineEventName = keyof UIEngineEventMap;

export type UIEngineEventListener<K extends UIEngineEventName> = (
    event: UIEngineEventMap[K],
) => void;


