import type {
    CatalogItem,
    CatalogItemRef,
} from "engine-model/catalog";
import { createCatalogItemRefKey } from "engine-model/catalog/lib";

type CollectDepsOptions = {
    rootRefs: CatalogItemRef[];
    resolveItem: (ref: CatalogItemRef) => CatalogItem | undefined;
    getDependencies: (item: CatalogItem) => CatalogItemRef[];
    validateRef?: (ref: CatalogItemRef) => boolean;
};

export type CatalogDependencyClosure = {
    items: CatalogItem[];
    missingRefs: CatalogItemRef[];
};

/** BFS over catalog refs with optional ref validation; dedups items and missing refs by ref key. */
export const collectDependenciesFromRoots = ({
    rootRefs,
    resolveItem,
    getDependencies,
    validateRef,
}: CollectDepsOptions): CatalogDependencyClosure => {
    const itemsByKey = new Map<string, CatalogItem>();
    const missingRefsByKey = new Map<string, CatalogItemRef>();
    const seen = new Set<string>();
    const queue: CatalogItemRef[] = [];

    rootRefs.forEach((ref) => {
        if (validateRef && !validateRef(ref)) return;
        const refKey = createCatalogItemRefKey(ref);
        if (seen.has(refKey)) return;

        seen.add(refKey);
        queue.push(ref);
    });

    while (queue.length > 0) {
        const currentRef = queue.shift();
        if (!currentRef) continue;

        const item = resolveItem(currentRef);
        if (!item) {
            const missingKey = createCatalogItemRefKey(currentRef);
            if (!missingRefsByKey.has(missingKey)) {
                missingRefsByKey.set(missingKey, currentRef);
            }
            continue;
        }

        const itemKey = createCatalogItemRefKey(item.ref);
        if (!itemsByKey.has(itemKey)) {
            itemsByKey.set(itemKey, item);
        }

        getDependencies(item).forEach((dependencyRef) => {
            if (validateRef && !validateRef(dependencyRef)) return;

            const dependencyKey = createCatalogItemRefKey(dependencyRef);
            if (seen.has(dependencyKey)) return;

            seen.add(dependencyKey);
            queue.push(dependencyRef);
        });
    }

    return {
        items: [...itemsByKey.values()],
        missingRefs: [...missingRefsByKey.values()],
    };
};
