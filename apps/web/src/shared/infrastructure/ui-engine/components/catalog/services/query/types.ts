import type {
    CatalogCompositionBoundary,
    CatalogCompositionModule,
    CatalogDocument,
    CatalogItem,
    CatalogItemKind,
    CatalogItemModule,
    CatalogItemModuleType,
    CatalogItemRef,
    CatalogLibraryDocument,
    CatalogLibrarySummary,
} from "@engine-model/catalog";

export type CatalogQueryService = {
    document: () => CatalogDocument;
    libraries: () => CatalogLibraryDocument[];
    librarySummaries: () => CatalogLibrarySummary[];
    getLibrary: (libraryId: string) => CatalogLibraryDocument | undefined;
    hasLibrary: (libraryId: string) => boolean;
    getLibraryItems: (libraryId: string) => CatalogItem[];
    getItem: (ref: CatalogItemRef) => CatalogItem | undefined;
    hasItem: (ref: CatalogItemRef) => boolean;
    getItemModules: (ref: CatalogItemRef) => CatalogItemModule[];
    getItemComposition: (ref: CatalogItemRef) => CatalogCompositionModule | undefined;
    getItemBoundary: (ref: CatalogItemRef) => CatalogCompositionBoundary | undefined;
    getDirectDependencies: (ref: CatalogItemRef) => CatalogItemRef[];
    getDependentItems: (ref: CatalogItemRef) => CatalogItem[];
    hasDependentItems: (ref: CatalogItemRef) => boolean;
    collectDependenciesFromRoots: (rootRefs: CatalogItemRef[]) => {
        items: CatalogItem[];
        missingRefs: CatalogItemRef[];
    };
    findItemsByKind: (kind: CatalogItemKind) => CatalogItem[];
    findItemsByModuleType: (moduleType: CatalogItemModuleType) => CatalogItem[];
};


