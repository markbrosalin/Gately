import type { Workspace, WorkspaceTabSession } from "engine-model";

export const createTestWorkspace = (
    overrides: Partial<Workspace> & Pick<Workspace, "id">,
): Workspace => ({
    id: overrides.id,
    kind: overrides.kind ?? "tab",
    title: overrides.title ?? overrides.id,
    path: overrides.path ?? [],
    childrenIds: overrides.childrenIds ?? [],
    createdAt: overrides.createdAt ?? 1,
    updatedAt: overrides.updatedAt,
});

export const createTestTabSession = (
    overrides: Partial<WorkspaceTabSession> & Pick<WorkspaceTabSession, "rootWorkspaceId">,
): WorkspaceTabSession => ({
    rootWorkspaceId: overrides.rootWorkspaceId,
    activeWorkspaceId: overrides.activeWorkspaceId ?? overrides.rootWorkspaceId,
    navigationPath: overrides.navigationPath ?? [overrides.rootWorkspaceId],
    settings: overrides.settings,
    createdAt: overrides.createdAt ?? 1,
    updatedAt: overrides.updatedAt,
});
