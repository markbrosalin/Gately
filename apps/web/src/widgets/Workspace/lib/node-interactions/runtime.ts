import type { Node } from "@antv/x6";

type NodeData = {
    hash?: string;
    __ui?: Record<string, unknown>;
};

const readNodeData = (node: Node): NodeData => (node.getData?.() ?? {}) as NodeData;

export const readNodeHash = (node: Node): string | undefined => readNodeData(node).hash;

export const readNodeRuntime = <T extends object>(node: Node): Partial<T> =>
    (readNodeData(node).__ui ?? {}) as Partial<T>;

export const patchNodeRuntime = <T extends object>(node: Node, patch: Partial<T>): void => {
    const data = readNodeData(node);
    const nextRuntime = { ...(data.__ui ?? {}), ...patch };
    node.setData({ ...data, __ui: nextRuntime });
};


