import type {
    CatalogDocument,
    CatalogItem,
    CatalogLibraryDocument,
} from "engine-model/catalog";

export type CatalogStateService = {
    document: () => CatalogDocument;
    libraries: () => CatalogLibraryDocument[];
    replaceDocument: (document: CatalogDocument) => void;
    upsertLibrary: (library: CatalogLibraryDocument) => CatalogLibraryDocument;
    removeLibrary: (libraryId: string) => CatalogLibraryDocument | undefined;
    upsertItem: (item: CatalogItem) => CatalogItem;
    removeItem: (item: CatalogItem) => CatalogItem | undefined;
};
