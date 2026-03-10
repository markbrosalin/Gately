export const idToPath = (id: string): string[] => {
    return id.split("/");
};

export const pathToId = (path: string[]): string => {
    return path.join("/");
};

