import { CATALOG_FORMAT_VERSION, type CatalogDocument } from "@engine-model/catalog";
import { catalogValidationIssues } from "../issues";
import { createValidationResult, prefixIssues, pushIssues } from "../helpers";
import type { CatalogValidationResult } from "@engine-model/catalog";
import { validateLibraryValue } from "./library";

export const validateDocumentValue = (
    document: CatalogDocument,
    path: Array<string | number> = [],
): CatalogValidationResult<"document"> => {
    const result = createValidationResult("document");

    if (document.formatVersion !== CATALOG_FORMAT_VERSION) {
        pushIssues(
            result,
            catalogValidationIssues.documentFormatVersionInvalid(path, document.formatVersion),
        );
    }

    const seenLibraryIds = new Set<string>();

    document.libraries.forEach((library, index) => {
        if (seenLibraryIds.has(library.manifest.id)) {
            pushIssues(
                result,
                catalogValidationIssues.documentLibraryDuplicate(path, index, library.manifest.id),
            );
        } else {
            seenLibraryIds.add(library.manifest.id);
        }

        pushIssues(
            result,
            prefixIssues(validateLibraryValue(library).issues, [...path, "libraries", index]),
        );
    });

    return result;
};


