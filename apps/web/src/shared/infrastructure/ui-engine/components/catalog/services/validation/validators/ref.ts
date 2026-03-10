import type { CatalogItemRef } from "@engine-model/catalog";
import { catalogValidationIssues } from "../issues";
import { createValidationResult, isNonEmptyString, pushIssues } from "../helpers";
import type { CatalogValidationResult } from "@engine-model/catalog";

export const validateRefValue = (
    ref: CatalogItemRef,
    path: Array<string | number> = [],
): CatalogValidationResult<"ref"> => {
    const result = createValidationResult("ref");

    if (!isNonEmptyString(ref.libraryId)) {
        pushIssues(result, catalogValidationIssues.refLibraryIdRequired(path));
    }

    if (!Array.isArray(ref.path)) {
        pushIssues(result, catalogValidationIssues.refPathInvalid(path));
    } else {
        ref.path.forEach((segment, index) => {
            if (!isNonEmptyString(segment)) {
                pushIssues(result, catalogValidationIssues.refPathSegmentInvalid(path, index));
            }
        });
    }

    if (!isNonEmptyString(ref.itemName)) {
        pushIssues(result, catalogValidationIssues.refItemNameRequired(path));
    }

    return result;
};
