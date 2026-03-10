import type { CatalogItem, CatalogLibraryDocument } from "@engine-model/catalog";
import { createCatalogItemRefKey } from "@engine-model/catalog/lib";

const mergeLibraryItems = (
    currentItems: CatalogItem[],
    importedItems: CatalogItem[],
): CatalogItem[] => {
    const itemsByRefKey = new Map<string, CatalogItem>();

    currentItems.forEach((item) => {
        itemsByRefKey.set(createCatalogItemRefKey(item.ref), item);
    });
    importedItems.forEach((item) => {
        itemsByRefKey.set(createCatalogItemRefKey(item.ref), item);
    });

    return [...itemsByRefKey.values()];
};

export const mergeLibraryDocuments = (
    currentLibrary: CatalogLibraryDocument,
    importedLibrary: CatalogLibraryDocument,
): CatalogLibraryDocument => {
    const mergedItems = mergeLibraryItems(currentLibrary.items, importedLibrary.items);

    return {
        formatVersion: importedLibrary.formatVersion,
        manifest: importedLibrary.manifest,
        items: mergedItems,
        ...(importedLibrary.extensions !== undefined
            ? { extensions: importedLibrary.extensions }
            : currentLibrary.extensions !== undefined
              ? { extensions: currentLibrary.extensions }
              : {}),
    };
};
