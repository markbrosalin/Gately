import { cloneCatalogValue, prefixCatalogIOIssues } from "../helpers";
import {
    CATALOG_FORMAT_VERSION,
    CatalogBundleLibrary,
    type CatalogBundleDocument,
    type CatalogItem,
    type CatalogItemRef,
} from "@engine-model/catalog";
import { createErrResult, createOkResult, type Issue } from "@engine-model";
import { catalogImportIssues } from "./issues";
import type { CatalogImportService, CatalogImportServiceDeps } from "./types";
import { createCatalogItemRefKey } from "@engine-model/catalog/lib";
import { collectDependenciesFromRoots } from "../../../helpers/collectDependenciesFromRoots";
import { getCompositionDependencies } from "../../../helpers/getCompositionDependencies";

type ItemsByRefKeyMap = Map<string, CatalogItem>;

/** Prepares external catalog payloads for safe use inside the catalog domain. */
export const createCatalogImportService = ({
    validation,
}: CatalogImportServiceDeps): CatalogImportService => {
    const _buildItemByRefMapAndPushBundleStructureIssues = (
        bundle: CatalogBundleDocument,
        issues: Issue[],
    ): ItemsByRefKeyMap => {
        const itemsByRefKey: ItemsByRefKeyMap = new Map();
        const seenLibraryIds = new Set<string>();

        bundle.libraries.forEach((library, libraryIndex) => {
            const libraryId = library.manifest.id;
            if (seenLibraryIds.has(libraryId)) {
                issues.push(catalogImportIssues.bundleLibraryDuplicate(libraryIndex, libraryId));
            } else {
                seenLibraryIds.add(libraryId);
            }

            library.items.forEach((item, itemIndexInLibrary) => {
                const refKey = createCatalogItemRefKey(item.ref);
                if (itemsByRefKey.has(refKey)) {
                    issues.push(
                        catalogImportIssues.bundleItemDuplicateRef(
                            ["libraries", libraryIndex, "items", itemIndexInLibrary, "ref"],
                            refKey,
                        ),
                    );
                    return;
                }

                itemsByRefKey.set(refKey, item);
            });
        });

        return itemsByRefKey;
    };

    const _pushMissingDependencyIssues = (
        rootRefs: CatalogItemRef[],
        itemsByRefKey: ItemsByRefKeyMap,
        issues: Issue[],
    ): void => {
        const closure = collectDependenciesFromRoots({
            rootRefs,
            resolveItem: (ref) => itemsByRefKey.get(createCatalogItemRefKey(ref)),
            getDependencies: getCompositionDependencies,
            validateRef: (ref) => validation.validateRef(ref).ok,
        });

        closure.missingRefs.forEach((ref) => {
            const refKey = createCatalogItemRefKey(ref);
            issues.push(
                catalogImportIssues.bundleDependencyMissing(
                    ["dependencyRefs", ref.libraryId, ...ref.path, ref.itemName],
                    refKey,
                ),
            );
        });
    };

    const _pushRootRefIssues = (
        rootRefs: CatalogItemRef[],
        itemsByRefKey: Map<string, CatalogItem>,
        issues: Issue[],
    ) => {
        for (let i = 0; i < rootRefs.length; i++) {
            const ref = rootRefs[i];
            const refResult = validation.validateRef(ref);

            if (!refResult.ok) {
                issues.push(...prefixCatalogIOIssues(refResult.issues, ["rootRefs", i]));
                continue;
            }

            const refKey = createCatalogItemRefKey(ref);
            if (!itemsByRefKey.has(refKey)) {
                issues.push(catalogImportIssues.bundleRootMissing(i, refKey));
            }
        }
    };

    const _pushLibraryIssues = (libraries: CatalogBundleLibrary[], issues: Issue[]) => {
        for (let i = 0; i < libraries.length; i++) {
            const lib = libraries[i];
            const libraryResult = validation.validateLibrary({
                formatVersion: CATALOG_FORMAT_VERSION,
                manifest: lib.manifest,
                items: lib.items,
                extensions: lib.extensions,
            });

            if (!libraryResult.ok) {
                issues.push(...prefixCatalogIOIssues(libraryResult.issues, ["libraries", i]));
            }
        }
    };

    const _pushBundleHeaderIssues = (bundle: CatalogBundleDocument, issues: Issue[]) => {
        if (bundle.formatVersion !== CATALOG_FORMAT_VERSION) {
            issues.push(catalogImportIssues.bundleFormatVersionInvalid(bundle.formatVersion));
        }

        if (bundle.rootRefs.length === 0) {
            issues.push(catalogImportIssues.bundleRootRefsRequired());
        }
    };

    return {
        importLibrary: (library) => {
            const result = validation.validateLibrary(library);
            if (!result.ok) {
                return createErrResult(result.issues);
            }

            return createOkResult(cloneCatalogValue(library));
        },
        importDocument: (document) => {
            const result = validation.validateDocument(document);
            if (!result.ok) {
                return createErrResult(result.issues);
            }

            return createOkResult(cloneCatalogValue(document));
        },
        importBundle: (bundle) => {
            const issues: Issue[] = [];
            const itemsByRefKey = _buildItemByRefMapAndPushBundleStructureIssues(bundle, issues);

            _pushBundleHeaderIssues(bundle, issues);

            _pushRootRefIssues(bundle.rootRefs, itemsByRefKey, issues);

            _pushLibraryIssues(bundle.libraries, issues);

            _pushMissingDependencyIssues(bundle.rootRefs, itemsByRefKey, issues);

            if (issues.length > 0) {
                return createErrResult(issues);
            }

            return createOkResult(cloneCatalogValue(bundle));
        },
    };
};


