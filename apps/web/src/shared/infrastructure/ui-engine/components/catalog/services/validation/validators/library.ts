import { CATALOG_FORMAT_VERSION, type CatalogLibraryDocument } from "@engine-model/catalog";
import { catalogValidationIssues } from "../issues";
import { createValidationResult, isNonEmptyString, prefixIssues, pushIssues } from "../helpers";
import type { CatalogValidationResult } from "@engine-model/catalog";
import { validateItemValue } from "./item";
import { validateRequiredTimestamps } from "./timestamps";
import { createCatalogItemRefKey } from "@engine-model/catalog/lib";

export const validateLibraryValue = (
    library: CatalogLibraryDocument,
    path: Array<string | number> = [],
): CatalogValidationResult<"library"> => {
    const result = createValidationResult("library");

    if (library.formatVersion !== CATALOG_FORMAT_VERSION) {
        pushIssues(
            result,
            catalogValidationIssues.libraryFormatVersionInvalid(path, library.formatVersion),
        );
    }

    if (!isNonEmptyString(library.manifest.id)) {
        pushIssues(result, catalogValidationIssues.libraryManifestIdRequired(path));
    }

    if (!isNonEmptyString(library.manifest.name)) {
        pushIssues(result, catalogValidationIssues.libraryManifestNameRequired(path));
    }

    if (!isNonEmptyString(library.manifest.version)) {
        pushIssues(result, catalogValidationIssues.libraryManifestVersionRequired(path));
    }

    validateRequiredTimestamps(library.manifest.createdAt, library.manifest.updatedAt, result, [
        ...path,
        "manifest",
    ]);

    const seenRefs = new Set<string>();

    library.items.forEach((item, index) => {
        if (item.ref.libraryId !== library.manifest.id) {
            pushIssues(
                result,
                catalogValidationIssues.libraryItemLibraryMismatch(
                    path,
                    library.manifest.id,
                    index,
                ),
            );
        }

        const refKey = createCatalogItemRefKey(item.ref);

        if (seenRefs.has(refKey)) {
            pushIssues(result, catalogValidationIssues.libraryItemDuplicateRef(path, index));
        } else {
            seenRefs.add(refKey);
        }

        pushIssues(result, prefixIssues(validateItemValue(item).issues, [...path, "items", index]));
    });

    return result;
};
