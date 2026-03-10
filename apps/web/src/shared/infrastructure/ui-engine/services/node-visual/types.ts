import type { Node } from "@antv/x6";
import type { LogicValue } from "@cnbn/schema";
import type { AnyVisualBinding, VisualBinding, VisualResolvedState } from "../../model/visual";
import type { PinSide } from "../../model";

export type RegisterVisualPresetOptions = {
    replace?: boolean;
};

export type ReadSignals = (node: Node, side: PinSide) => Record<string, LogicValue | undefined>;

export type VisualExecutorContract<TState extends string = string> = {
    mount: (node: Node) => VisualResolvedState<TState>;
    update: (node: Node) => VisualResolvedState<TState>;
    unmount: (node: Node) => void;
    getState: (node: Node) => VisualResolvedState<TState> | undefined;
};

export type AnyVisualExecutor = VisualExecutorContract<string>;

export type VisualPortLayoutRegistratorContract = {
    registerPortLayouts: () => void;
};

export type VisualNodeRegistratorContract = VisualPortLayoutRegistratorContract & {
    registerNodeFromPreset: (binding: AnyVisualBinding) => void;
};

export type VisualServiceContract = {
    usePresets: <TState extends string>(
        presets: VisualBinding<TState>[],
        options?: RegisterVisualPresetOptions,
    ) => string[];
    getPreset: <TState extends string = string>(hash: string) => VisualBinding<TState> | undefined;
    removePreset: (hash: string) => boolean;
    listPresetKeys: () => string[];
    mountNode: (node: Node) => VisualResolvedState<string> | undefined;
    updateNode: (node: Node) => VisualResolvedState<string> | undefined;
    unmountNode: (node: Node) => void;
    updateByNodeId: (nodeId: string) => VisualResolvedState<string> | undefined;
};

