import {
    CATALOG_FORMAT_VERSION,
    type CatalogItem,
    type CatalogBundleLibrary,
} from "@engine-model/catalog";
import { createErrResult, createOkResult } from "@engine-model";
import { cloneCatalogValue } from "../helpers";
import { createCatalogItemRefKey } from "@engine-model/catalog/lib";
import { catalogExportIssues } from "./issues";
import type { CatalogExportService, CatalogExportServiceDeps } from "./types";

/** Reads and clones current catalog data for document-level export. */
export const createCatalogExportService = ({
    query,
}: CatalogExportServiceDeps): CatalogExportService => {
    const _upsertBundleItem = (
        libraries: Map<string, CatalogBundleLibrary>,
        item: CatalogItem,
    ): void => {
        const library = query.getLibrary(item.ref.libraryId);
        if (!library) return;

        const current = libraries.get(item.ref.libraryId);
        if (!current) {
            libraries.set(item.ref.libraryId, {
                manifest: library.manifest,
                items: [item],
            });
            return;
        }

        current.items = [...current.items, item];
    };

    const _collectBundleLibraries = (items: CatalogItem[]): CatalogBundleLibrary[] => {
        const libraries = new Map<string, CatalogBundleLibrary>();

        items.forEach((item) => {
            _upsertBundleItem(libraries, item);
        });

        return [...libraries.values()];
    };

    return {
        exportLibrary: ({ libraryId }) => {
            if (!libraryId) {
                return createErrResult([catalogExportIssues.libraryIdRequired()]);
            }

            const library = query.getLibrary(libraryId);
            if (!library) {
                return createErrResult([catalogExportIssues.libraryNotFound(libraryId)]);
            }

            return createOkResult(cloneCatalogValue(library));
        },
        exportBundle: ({ rootRefs }) => {
            if (rootRefs.length === 0) {
                return createErrResult([catalogExportIssues.bundleRootRefsRequired()]);
            }

            const missingRootIndex = rootRefs.findIndex((ref) => !query.getItem(ref));
            if (missingRootIndex !== -1) {
                const missingRootRef = rootRefs[missingRootIndex]!;
                return createErrResult([
                    catalogExportIssues.bundleRootNotFound(
                        missingRootIndex,
                        createCatalogItemRefKey(missingRootRef),
                    ),
                ]);
            }

            const dependencies = query.collectDependenciesFromRoots(rootRefs);
            const issues = dependencies.missingRefs.map((ref) =>
                catalogExportIssues.bundleDependencyNotFound(
                    ["dependencyRefs", ref.libraryId, ...ref.path, ref.itemName],
                    createCatalogItemRefKey(ref),
                ),
            );
            if (issues.length > 0) {
                return createErrResult(issues);
            }

            const libraries = _collectBundleLibraries(dependencies.items);

            return createOkResult(
                cloneCatalogValue({
                    formatVersion: CATALOG_FORMAT_VERSION,
                    rootRefs,
                    libraries,
                }),
            );
        },
        exportDocument: () => createOkResult(cloneCatalogValue(query.document())),
    };
};


