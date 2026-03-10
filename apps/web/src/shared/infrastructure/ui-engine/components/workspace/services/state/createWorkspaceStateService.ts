import { createStore, produce } from "solid-js/store";
import { getParentWorkspaceId, type Workspace, type WorkspaceTabSession } from "@engine-model";
import { collectWorkspaceTreeIds } from "../../helpers";
import type { WorkspaceStateService } from "./types";

type WorkspaceStateStore = {
    workspaces: Record<string, Workspace>;
    tabSessions: Record<string, WorkspaceTabSession>;
    orderedTabIds: string[];
    activeWorkspaceId: string | undefined;
    activeTabId: string | undefined;
};

export const createWorkspaceStateService = (): WorkspaceStateService => {
    const [store, setStore] = createStore<WorkspaceStateStore>({
        workspaces: {},
        tabSessions: {},
        orderedTabIds: [],
        activeWorkspaceId: undefined,
        activeTabId: undefined,
    });

    const orderedTabIds = () => store.orderedTabIds;
    const activeTabId = () => store.activeTabId;
    const activeWorkspaceId = () => store.activeWorkspaceId;

    const getWorkspace = (workspaceId: string): Workspace | undefined => {
        return store.workspaces[workspaceId];
    };

    const getTabSession = (rootWorkspaceId: string): WorkspaceTabSession | undefined => {
        return store.tabSessions[rootWorkspaceId];
    };

    const upsertWorkspace = (workspace: Workspace): Workspace => {
        setStore(
            produce((state) => {
                const existingWorkspace = state.workspaces[workspace.id];
                state.workspaces[workspace.id] = existingWorkspace
                    ? {
                          ...workspace,
                          createdAt: existingWorkspace.createdAt,
                          updatedAt: Date.now(),
                      }
                    : workspace;

                const parentWorkspaceId = getParentWorkspaceId(workspace.path);
                if (!parentWorkspaceId) return;

                const parent = state.workspaces[parentWorkspaceId];
                if (!parent) return;
                if (parent.childrenIds.includes(workspace.id)) return;

                parent.childrenIds = [...parent.childrenIds, workspace.id];
                parent.updatedAt = Date.now();
            }),
        );

        return workspace;
    };

    const removeWorkspace = (workspaceId: string): Workspace | undefined => {
        const workspace = getWorkspace(workspaceId);
        if (!workspace) return undefined;
        const workspaceIds = collectWorkspaceTreeIds(store.workspaces, workspaceId);

        setStore(
            produce((state) => {
                workspaceIds.forEach((entryId) => {
                    delete state.workspaces[entryId];
                });

                Object.values(state.workspaces).forEach((entry) => {
                    entry.childrenIds = entry.childrenIds.filter(
                        (childId) => !workspaceIds.includes(childId),
                    );
                });

                if (
                    state.activeWorkspaceId !== undefined &&
                    workspaceIds.includes(state.activeWorkspaceId)
                ) {
                    state.activeWorkspaceId = undefined;
                }
            }),
        );

        return workspace;
    };

    const upsertTabSession = (
        session: WorkspaceTabSession,
        rootWorkspace: Workspace,
    ): WorkspaceTabSession => {
        setStore(
            produce((state) => {
                const existingSession = state.tabSessions[session.rootWorkspaceId];
                const existingRootWorkspace = state.workspaces[rootWorkspace.id];

                state.workspaces[rootWorkspace.id] = existingRootWorkspace
                    ? {
                          ...rootWorkspace,
                          createdAt: existingRootWorkspace.createdAt,
                          updatedAt: Date.now(),
                      }
                    : rootWorkspace;

                state.tabSessions[session.rootWorkspaceId] = existingSession
                    ? {
                          ...session,
                          createdAt: existingSession.createdAt,
                          updatedAt: Date.now(),
                      }
                    : session;

                if (!state.orderedTabIds.includes(session.rootWorkspaceId)) {
                    state.orderedTabIds = [...state.orderedTabIds, session.rootWorkspaceId];
                }
            }),
        );

        return session;
    };

    const removeTabSession = (rootWorkspaceId: string): WorkspaceTabSession | undefined => {
        const session = getTabSession(rootWorkspaceId);
        if (!session) return undefined;

        const workspaceIds = collectWorkspaceTreeIds(store.workspaces, rootWorkspaceId);

        setStore(
            produce((state) => {
                delete state.tabSessions[rootWorkspaceId];

                workspaceIds.forEach((workspaceId) => {
                    delete state.workspaces[workspaceId];
                });

                state.orderedTabIds = state.orderedTabIds.filter(
                    (tabId) => tabId !== rootWorkspaceId,
                );

                if (state.activeTabId === rootWorkspaceId) {
                    state.activeTabId = undefined;
                }

                if (
                    state.activeWorkspaceId !== undefined &&
                    workspaceIds.includes(state.activeWorkspaceId)
                ) {
                    state.activeWorkspaceId = undefined;
                }
            }),
        );

        return session;
    };

    const attachChildWorkspace = (parentWorkspaceId: string, childWorkspaceId: string): void => {
        setStore(
            produce((state) => {
                const parent = state.workspaces[parentWorkspaceId];
                if (!parent) return;
                if (parent.childrenIds.includes(childWorkspaceId)) return;

                parent.childrenIds = [...parent.childrenIds, childWorkspaceId];
                parent.updatedAt = Date.now();
            }),
        );
    };

    const setWorkspaceTitle = (workspaceId: string, title: string): void => {
        setStore(
            produce((state) => {
                const workspace = state.workspaces[workspaceId];
                if (!workspace) return;

                workspace.title = title;
                workspace.updatedAt = Date.now();
            }),
        );
    };

    const setActiveWorkspace = (workspaceId?: string): void => {
        setStore("activeWorkspaceId", workspaceId);
    };

    const setActiveTab = (tabId?: string): void => {
        setStore("activeTabId", tabId);
    };

    const setNavigationPath = (rootWorkspaceId: string, navigationPath: string[]): void => {
        setStore(
            produce((state) => {
                const session = state.tabSessions[rootWorkspaceId];
                if (!session) return;

                session.navigationPath = navigationPath;
                session.activeWorkspaceId = navigationPath.at(-1) ?? session.activeWorkspaceId;
                session.updatedAt = Date.now();
            }),
        );
    };

    return {
        orderedTabIds,
        activeTabId,
        activeWorkspaceId,
        getWorkspace,
        getTabSession,
        upsertWorkspace,
        removeWorkspace,
        upsertTabSession,
        removeTabSession,
        attachChildWorkspace,
        setWorkspaceTitle,
        setActiveWorkspace,
        setActiveTab,
        setNavigationPath,
    };
};
