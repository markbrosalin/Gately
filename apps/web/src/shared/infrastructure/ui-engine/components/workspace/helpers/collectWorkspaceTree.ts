import type { Workspace } from "@engine-model";

type WorkspaceGetter = (workspaceId: string) => Workspace | undefined;
type WorkspaceChildrenGetter = (workspaceId: string) => Workspace[];

export const collectWorkspaceTreeIds = (
    workspaces: Record<string, Workspace>,
    rootWorkspaceId: string,
): string[] => {
    const queue = [rootWorkspaceId];
    const collected: string[] = [];

    while (queue.length > 0) {
        const workspaceId = queue.shift();
        if (!workspaceId) continue;

        collected.push(workspaceId);

        const workspace = workspaces[workspaceId];
        if (!workspace) continue;

        queue.push(...workspace.childrenIds);
    }

    return collected;
};

export const collectWorkspaceTree = (
    workspaces: Record<string, Workspace>,
    rootWorkspaceId: string,
): Workspace[] => {
    return collectWorkspaceTreeIds(workspaces, rootWorkspaceId)
        .map((workspaceId) => workspaces[workspaceId])
        .filter((workspace): workspace is Workspace => Boolean(workspace));
};

export const collectWorkspaceTreeByQuery = (
    rootWorkspaceId: string,
    getWorkspace: WorkspaceGetter,
    getWorkspaceChildren: WorkspaceChildrenGetter,
): Workspace[] => {
    const rootWorkspace = getWorkspace(rootWorkspaceId);
    if (!rootWorkspace) {
        return [];
    }

    const collected: Workspace[] = [];
    const queue: Workspace[] = [rootWorkspace];

    while (queue.length > 0) {
        const workspace = queue.shift();
        if (!workspace) {
            continue;
        }

        collected.push(workspace);
        queue.push(...getWorkspaceChildren(workspace.id));
    }

    return collected;
};


