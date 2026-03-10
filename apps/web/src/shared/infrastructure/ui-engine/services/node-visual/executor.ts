import type { Node } from "@antv/x6";
import type {
    VisualBinding,
    VisualIndexedStatePatch,
    VisualPatch,
    VisualResolvedState,
} from "../../model/visual";
import { mergeAttrs } from "./lib/attrs";
import type { ReadSignals, VisualExecutorContract } from "./types";

const VISUAL_BATCH_NAME = "update";

const mergeUnique = (left?: string[], right?: string[]): string[] | undefined => {
    const tokens = [...(left ?? []), ...(right ?? [])].filter(Boolean);
    if (!tokens.length) return;
    return Array.from(new Set(tokens));
};

const mergeClassPatch = (base?: VisualPatch["class"], patch?: VisualPatch["class"]) => {
    if (!base && !patch) return;
    if (!base) return patch;
    if (!patch) return base;

    const next: NonNullable<VisualPatch["class"]> = { ...base };
    for (const [selector, rule] of Object.entries(patch)) {
        next[selector] = {
            add: mergeUnique(base[selector]?.add, rule?.add),
            remove: mergeUnique(base[selector]?.remove, rule?.remove),
        };
    }

    return next;
};

const mergeIndexedAttrs = (
    attrs: VisualPatch["attrs"],
    targetSelector: string,
    patch?: VisualIndexedStatePatch["attrs"],
): VisualPatch["attrs"] => {
    if (!patch) return attrs;

    return {
        ...(attrs ?? {}),
        [targetSelector]: {
            ...((attrs ?? {})[targetSelector] ?? {}),
            ...patch,
        },
    };
};

const mergeIndexedClass = (
    classPatch: VisualPatch["class"],
    targetSelector: string,
    patch?: VisualIndexedStatePatch["class"],
): VisualPatch["class"] => {
    if (!patch) return classPatch;

    return {
        ...(classPatch ?? {}),
        [targetSelector]: {
            add: mergeUnique(classPatch?.[targetSelector]?.add, patch.add),
            remove: mergeUnique(classPatch?.[targetSelector]?.remove, patch.remove),
        },
    };
};

const areStatesEqual = <TState extends string>(
    left?: VisualResolvedState<TState>,
    right?: VisualResolvedState<TState>,
): boolean => {
    if (left == null || right == null) return left === right;

    if (Array.isArray(left) || Array.isArray(right)) {
        if (!Array.isArray(left) || !Array.isArray(right)) return false;
        if (left.length !== right.length) return false;
        return left.every((value, index) => value === right[index]);
    }

    return left === right;
};

const applyClassPatch = (node: Node, patch?: VisualPatch["class"]): void => {
    if (!patch) return;

    for (const [selector, rule] of Object.entries(patch)) {
        const currentRaw = node.getAttrByPath(`${selector}/class`);
        const current = typeof currentRaw === "string" ? currentRaw : "";
        const tokens = new Set(current.split(/\s+/).filter(Boolean));

        for (const token of rule.remove ?? []) {
            tokens.delete(token);
        }
        for (const token of rule.add ?? []) {
            tokens.add(token);
        }

        const next = Array.from(tokens).join(" ").trim();
        node.setAttrByPath(`${selector}/class`, next);
    }
};

export const createVisualExecutor = <TState extends string>(
    binding: VisualBinding<TState>,
    readSignals: ReadSignals,
): VisualExecutorContract<TState> => {
    const stateMap = new WeakMap<Node, VisualResolvedState<TState>>();

    const _runInBatch = (node: Node, run: () => void): void => {
        node.startBatch(VISUAL_BATCH_NAME);
        try {
            run();
        } finally {
            node.stopBatch(VISUAL_BATCH_NAME);
        }
    };

    const _applyPatch = (node: Node, patch: VisualPatch): void => {
        if (patch.attrs) {
            node.setAttrs(patch.attrs, { deep: true });
        }
        if (patch.class) {
            applyClassPatch(node, patch.class);
        }
    };

    const _applyState = (node: Node, state: VisualResolvedState<TState>): void => {
        const base = binding.preset.base ?? {};
        let attrs = base.attrs;
        let classPatch = base.class;

        if (Array.isArray(state) && binding.preset.indexedStates) {
            for (const [index, item] of state.entries()) {
                const targetSelector = binding.preset.indexedStates.targets[index];
                if (!targetSelector) continue;

                const variant = binding.preset.indexedStates.states[item as TState] ?? {};
                attrs = mergeIndexedAttrs(attrs, targetSelector, variant.attrs);
                classPatch = mergeIndexedClass(classPatch, targetSelector, variant.class);
            }
        } else {
            const variants = Array.isArray(state)
                ? state.map((item) => binding.preset.states[item as TState] ?? {})
                : [binding.preset.states[state as TState] ?? {}];

            for (const variant of variants) {
                attrs = mergeAttrs(attrs, variant.attrs);
                classPatch = mergeClassPatch(classPatch, variant.class);
            }
        }

        const merged: VisualPatch = {
            attrs,
            class: classPatch,
        };

        _runInBatch(node, () => {
            _applyPatch(node, merged);
        });

        stateMap.set(node, state);
    };

    const update = (node: Node): VisualResolvedState<TState> => {
        const prev = stateMap.get(node);
        const next = binding.resolveState({
            node,
            spec: binding.preset,
            currentState: prev,
            readSignals: (side) => readSignals(node, side),
        });

        if (!areStatesEqual(prev, next)) {
            _applyState(node, next);
        }

        return next;
    };

    return {
        mount: (node: Node) => update(node),
        update,
        unmount: (node: Node) => {
            stateMap.delete(node);
        },
        getState: (node: Node) => stateMap.get(node),
    };
};

