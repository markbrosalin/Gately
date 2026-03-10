import { mergeObjects } from "@gately/shared/lib/object";
import { DEFAULT_SCOPE_SNAPSHOT, type UIScopeSnapshot } from "../../model";

export const mergeScopeSnapshot = (
    current: Partial<UIScopeSnapshot>,
    next?: Partial<UIScopeSnapshot> | null,
): Partial<UIScopeSnapshot> => {
    if (!next) return current;

    const merged = mergeObjects<UIScopeSnapshot>(DEFAULT_SCOPE_SNAPSHOT, current, next);

    if (!current.extensions && !next.extensions) {
        return {
            contentJson: merged.contentJson,
            viewport: merged.viewport,
        };
    }

    return merged;
};

