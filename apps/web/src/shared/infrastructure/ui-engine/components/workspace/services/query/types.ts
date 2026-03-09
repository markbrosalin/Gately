import type {
    Workspace,
    WorkspaceTabCloseConditions,
    WorkspaceTabSession,
} from "engine-model";

export type WorkspaceQueryTab = Pick<Workspace, "id" | "title">;

export type WorkspaceQueryService = {
    activeTabId: () => string | undefined;
    activeWorkspaceId: () => string | undefined;

    orderedTabs: () => WorkspaceQueryTab[];

    findWorkspace: (workspaces: Workspace[], workspaceId: string) => Workspace | undefined;
    getWorkspace: (workspaceId: string) => Workspace | undefined;
    getWorkspaceRootId: (workspaceId: string) => string | undefined;
    getWorkspaceOpenPath: (workspaceId: string) => string[];
    getWorkspaceChildren: (workspaceId: string) => Workspace[];
    getNavigationPath: (tabId: string) => string[];
    getNavigationWorkspaces: (tabId: string) => Workspace[];
    getNextActiveTabIdAfterClose: (tabId: string) => string | undefined;
    canCloseTab: (tabId: string, conditions?: WorkspaceTabCloseConditions) => boolean;
    hasWorkspace: (workspaceId: string) => boolean;

    getTabSession: (tabId: string) => WorkspaceTabSession | undefined;
    hasTabSession: (tabId: string) => boolean;

    getActiveWorkspace: () => Workspace | undefined;
    getActiveTabSession: () => WorkspaceTabSession | undefined;
};
