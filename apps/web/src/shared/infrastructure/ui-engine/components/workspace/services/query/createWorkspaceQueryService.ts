import type { Workspace, WorkspaceTabCloseConditions, WorkspaceTabSession } from "@engine-model";
import type { WorkspaceStateService } from "../state/types";
import type { WorkspaceServiceContext } from "../types";
import type { WorkspaceQueryService, WorkspaceQueryTab } from "./types";

export const createWorkspaceQueryApi = (state: WorkspaceStateService): WorkspaceQueryService => {
    const orderedTabs = (): WorkspaceQueryTab[] =>
        state
            .orderedTabIds()
            .map((tabId) => {
                const workspace = state.getWorkspace(tabId);
                if (!workspace) return undefined;

                return {
                    id: workspace.id,
                    title: workspace.title,
                };
            })
            .filter((tab): tab is WorkspaceQueryTab => Boolean(tab));

    const findWorkspace = (workspaces: Workspace[], workspaceId: string): Workspace | undefined => {
        return workspaces.find((workspace) => workspace.id === workspaceId);
    };

    const getWorkspace = state.getWorkspace;
    const getTabSession = state.getTabSession;
    const activeTabId = state.activeTabId;
    const activeWorkspaceId = state.activeWorkspaceId;

    const getWorkspaceRootId = (workspaceId: string): string | undefined => {
        const workspace = getWorkspace(workspaceId);
        if (!workspace) return undefined;

        return workspace.path[0] ?? workspace.id;
    };

    const getWorkspaceOpenPath = (workspaceId: string): string[] => {
        const workspace = getWorkspace(workspaceId);
        if (!workspace) return [];

        const rootWorkspaceId = getWorkspaceRootId(workspaceId);
        if (!rootWorkspaceId) return [];

        const absolutePath = [...workspace.path, workspace.id];
        const rootIndex = absolutePath.indexOf(rootWorkspaceId);

        return rootIndex >= 0 ? absolutePath.slice(rootIndex) : [rootWorkspaceId, workspace.id];
    };

    const getWorkspaceChildren = (workspaceId: string): Workspace[] => {
        const workspace = getWorkspace(workspaceId);
        if (!workspace) return [];

        return workspace.childrenIds
            .map((childId) => getWorkspace(childId))
            .filter((child): child is Workspace => Boolean(child));
    };

    const getNavigationPath = (tabId: string): string[] => {
        return state.getTabSession(tabId)?.navigationPath ?? [];
    };

    const getNavigationWorkspaces = (tabId: string): Workspace[] => {
        return getNavigationPath(tabId)
            .map((workspaceId) => getWorkspace(workspaceId))
            .filter((workspace): workspace is Workspace => Boolean(workspace));
    };

    const hasWorkspace = (workspaceId: string): boolean => Boolean(getWorkspace(workspaceId));

    const hasTabSession = (tabId: string): boolean => Boolean(getTabSession(tabId));
    const canCloseTab = (tabId: string, conditions?: WorkspaceTabCloseConditions): boolean => {
        if (orderedTabs().length <= 1) return false;
        if (!hasTabSession(tabId)) return false;
        if (conditions?.isEditing) return false;
        return true;
    };

    const getNextActiveTabIdAfterClose = (tabId: string): string | undefined => {
        const currentActiveTabId = activeTabId();
        if (currentActiveTabId !== tabId) {
            return currentActiveTabId;
        }

        const tabs = orderedTabs();
        const tabIndex = tabs.findIndex((tab) => tab.id === tabId);
        if (tabIndex < 0) {
            return undefined;
        }

        return tabs[tabIndex + 1]?.id ?? tabs[tabIndex - 1]?.id;
    };

    const getActiveWorkspace = (): Workspace | undefined => {
        const workspaceId = activeWorkspaceId();
        return workspaceId ? getWorkspace(workspaceId) : undefined;
    };
    const getActiveTabSession = (): WorkspaceTabSession | undefined => {
        const tabId = activeTabId();
        return tabId ? getTabSession(tabId) : undefined;
    };

    return {
        orderedTabs,
        activeTabId,
        activeWorkspaceId,
        findWorkspace,
        getWorkspace,
        getWorkspaceRootId,
        getWorkspaceOpenPath,
        getWorkspaceChildren,
        getNavigationPath,
        getNavigationWorkspaces,
        getNextActiveTabIdAfterClose,
        canCloseTab,
        hasWorkspace,
        getTabSession,
        hasTabSession,
        getActiveWorkspace,
        getActiveTabSession,
    };
};

export const createWorkspaceQueryService = (
    ctx: WorkspaceServiceContext,
): WorkspaceQueryService => {
    return createWorkspaceQueryApi(ctx.getService("state"));
};
