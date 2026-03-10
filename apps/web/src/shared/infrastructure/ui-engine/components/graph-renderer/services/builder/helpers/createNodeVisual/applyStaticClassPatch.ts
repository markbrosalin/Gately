import type { CatalogVisualPatch } from "@engine-model/catalog";
import type { CellAttrs } from "@antv/x6/lib/registry/attr";
import { mergeClassTokens } from "./mergeClassTokens";

export const applyStaticClassPatch = (
    attrs: CellAttrs | undefined,
    classPatch?: CatalogVisualPatch["class"],
): CellAttrs | undefined => {
    if (!classPatch) {
        return attrs;
    }

    const next: CellAttrs = { ...(attrs ?? {}) };
    for (const [selector, rule] of Object.entries(classPatch)) {
        const currentSelectorAttrs = { ...(next[selector] ?? {}) };
        const nextClass = mergeClassTokens(
            typeof currentSelectorAttrs.class === "string" ? currentSelectorAttrs.class : undefined,
            rule?.add,
            rule?.remove,
        );

        if (nextClass !== undefined) {
            currentSelectorAttrs.class = nextClass;
        } else {
            delete currentSelectorAttrs.class;
        }

        next[selector] = currentSelectorAttrs;
    }

    return next;
};
