export const WORKSPACE_TAB_CREATED_EVENT = "workspace:tab-created";
export const WORKSPACE_TAB_OPENED_EVENT = "workspace:tab-opened";
export const WORKSPACE_TAB_CLOSED_EVENT = "workspace:tab-closed";
export const WORKSPACE_NAVIGATION_CHANGED_EVENT = "workspace:navigation-changed";

export type WorkspaceTabCreatedEvent = {
    tabId: string;
    rootScopeId: string;
};

export type WorkspaceTabOpenedEvent = {
    tabId: string;
    activeScopeId: string;
    navigationPath: string[];
};

export type WorkspaceTabClosedEvent = {
    tabId: string;
    nextActiveTabId?: string;
};

export type WorkspaceNavigationChangedEvent = {
    tabId: string;
    activeScopeId: string;
    navigationPath: string[];
};


