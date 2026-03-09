import type { Workspace, WorkspaceTabSession } from "engine-model";

export type WorkspaceStateService = {
    orderedTabIds: () => string[];
    activeTabId: () => string | undefined;
    activeWorkspaceId: () => string | undefined;

    getWorkspace: (workspaceId: string) => Workspace | undefined;
    getTabSession: (rootWorkspaceId: string) => WorkspaceTabSession | undefined;

    upsertWorkspace: (workspace: Workspace) => Workspace;
    removeWorkspace: (workspaceId: string) => Workspace | undefined;

    upsertTabSession: (
        session: WorkspaceTabSession,
        rootWorkspace: Workspace,
    ) => WorkspaceTabSession;
    removeTabSession: (rootWorkspaceId: string) => WorkspaceTabSession | undefined;

    attachChildWorkspace: (parentWorkspaceId: string, childWorkspaceId: string) => void;

    setWorkspaceTitle: (workspaceId: string, title: string) => void;
    setActiveWorkspace: (workspaceId?: string) => void;
    setActiveTab: (tabId?: string) => void;
    setNavigationPath: (rootWorkspaceId: string, navigationPath: string[]) => void;
};
