import type { CellAttrs } from "@antv/x6/lib/registry/attr";

export function mergeAttrs(base: CellAttrs, patch?: CellAttrs): CellAttrs;
export function mergeAttrs(base?: CellAttrs, patch?: CellAttrs): CellAttrs | undefined;
export function mergeAttrs(base?: CellAttrs, patch?: CellAttrs): CellAttrs | undefined {
    if (!base && !patch) return;
    if (!base) return patch;
    if (!patch) return base;

    const next: CellAttrs = { ...base };
    for (const [selector, attrs] of Object.entries(patch)) {
        next[selector] = {
            ...(base[selector] ?? {}),
            ...(attrs ?? {}),
        };
    }

    return next;
}

