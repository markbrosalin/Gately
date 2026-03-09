import type { CatalogItemRef } from "../ref";

export const createCatalogItemRefKey = (ref: CatalogItemRef): string => {
    return [ref.libraryId, ...ref.path, ref.itemName].join("::");
};
