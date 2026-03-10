import { createMemo } from "solid-js";
import type {
    CatalogCompositionModule,
    CatalogItem,
    CatalogItemKind,
    CatalogItemModule,
    CatalogItemModuleType,
    CatalogItemRef,
    CatalogLibraryDocument,
    CatalogLibrarySummary,
} from "@engine-model/catalog";
import { createCatalogItemRefKey } from "@engine-model/catalog/lib";
import { isSameItemRef } from "../../helpers/isSameItemRef";
import { getCompositionDependencies } from "../../helpers/getCompositionDependencies";
import { collectDependenciesFromRoots } from "../../helpers/collectDependenciesFromRoots";
import type { CatalogStateService } from "../state";
import type { CatalogServiceContext } from "../types";
import type { CatalogQueryService } from "./types";

export const createCatalogQueryApi = (state: CatalogStateService): CatalogQueryService => {
    const document = () => state.document();
    const libraries = () => state.libraries();
    const librarySummaries = createMemo<CatalogLibrarySummary[]>(() =>
        libraries().map(({ manifest }) => ({
            id: manifest.id,
            name: manifest.name,
            version: manifest.version,
        })),
    );

    const getLibrary = (libraryId: string): CatalogLibraryDocument | undefined => {
        return libraries().find((library) => library.manifest.id === libraryId);
    };

    const hasLibrary = (libraryId: string): boolean => {
        return Boolean(getLibrary(libraryId));
    };

    const getLibraryItems = (libraryId: string): CatalogItem[] => {
        return getLibrary(libraryId)?.items ?? [];
    };

    const getItem = (ref: CatalogItemRef): CatalogItem | undefined => {
        return getLibraryItems(ref.libraryId).find((item) => isSameItemRef(item.ref, ref));
    };

    const hasItem = (ref: CatalogItemRef): boolean => {
        return Boolean(getItem(ref));
    };

    const getItemModules = (ref: CatalogItemRef): CatalogItemModule[] => {
        return getItem(ref)?.modules ?? [];
    };

    const getItemComposition = (ref: CatalogItemRef): CatalogCompositionModule | undefined => {
        return getItemModules(ref).find(
            (module): module is CatalogCompositionModule => module.type === "composition",
        );
    };

    const getItemBoundary = (ref: CatalogItemRef) => {
        return getItemComposition(ref)?.config.boundary;
    };

    const getDirectDependencies = (ref: CatalogItemRef): CatalogItemRef[] => {
        const item = getItem(ref);
        if (!item) return [];
        return getCompositionDependencies(item);
    };

    const dependentItemRefsByDependencyKey = createMemo(() => {
        const map = new Map<string, CatalogItemRef[]>();

        libraries().forEach((library) => {
            library.items.forEach((item) => {
                getCompositionDependencies(item).forEach((dependencyRef) => {
                    const dependencyKey = createCatalogItemRefKey(dependencyRef);
                    const current = map.get(dependencyKey);

                    if (current) {
                        current.push(item.ref);
                        return;
                    }

                    map.set(dependencyKey, [item.ref]);
                });
            });
        });

        return map;
    });

    const getDependentItems = (ref: CatalogItemRef): CatalogItem[] => {
        const dependencyKey = createCatalogItemRefKey(ref);
        const dependentRefs = dependentItemRefsByDependencyKey().get(dependencyKey) ?? [];

        return dependentRefs
            .map((dependentRef) => getItem(dependentRef))
            .filter((item): item is CatalogItem => Boolean(item));
    };

    const hasDependentItems = (ref: CatalogItemRef): boolean => {
        return getDependentItems(ref).length > 0;
    };

    const collectDependenciesFromRootsForCatalog = (rootRefs: CatalogItemRef[]) =>
        collectDependenciesFromRoots({
            rootRefs,
            resolveItem: getItem,
            getDependencies: getCompositionDependencies,
        });

    const findItemsByKind = (kind: CatalogItemKind): CatalogItem[] => {
        return libraries()
            .flatMap((library) => library.items)
            .filter((item) => item.kind === kind);
    };

    const findItemsByModuleType = (moduleType: CatalogItemModuleType): CatalogItem[] => {
        return libraries()
            .flatMap((library) => library.items)
            .filter((item) => item.modules.some((module) => module.type === moduleType));
    };

    return {
        document,
        libraries,
        librarySummaries,
        getLibrary,
        hasLibrary,
        getLibraryItems,
        getItem,
        hasItem,
        getItemModules,
        getItemComposition,
        getItemBoundary,
        getDirectDependencies,
        getDependentItems,
        hasDependentItems,
        collectDependenciesFromRoots: collectDependenciesFromRootsForCatalog,
        findItemsByKind,
        findItemsByModuleType,
    };
};

export const createCatalogQueryService = (ctx: CatalogServiceContext): CatalogQueryService => {
    return createCatalogQueryApi(ctx.getService("state"));
};


