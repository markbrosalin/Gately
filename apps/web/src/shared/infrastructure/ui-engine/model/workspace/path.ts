export const getRootWorkspaceId = (path: string[]): string | undefined => {
    return path[0];
};

export const getParentWorkspaceId = (path: string[]): string | undefined => {
    return path.at(-1);
};

