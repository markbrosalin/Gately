export function removeItemById<T extends { id: string }>(array: T[], id: string): T | undefined {
    const index = array.findIndex((item) => item.id === id);
    if (index === -1) return;
    return array.splice(index, 1)[0];
}

export function getItemById<T extends { id: string }>(array: T[], id: string): T | undefined {
    return array.find((item) => item.id === id);
}

export function getIndexById<T extends { id: string }>(array: T[], id: string): number {
    return array.findIndex((item) => item.id === id);
}

