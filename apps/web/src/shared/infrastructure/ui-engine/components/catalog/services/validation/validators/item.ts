import type { CatalogItem } from "@engine-model/catalog";
import { catalogValidationIssues } from "../issues";
import {
    createValidationResult,
    isNonEmptyString,
    isPositiveFiniteNumber,
    prefixIssues,
    pushIssues,
} from "../helpers";
import type { CatalogValidationResult } from "@engine-model/catalog";
import { validateModuleValue } from "./module";
import { validateRefValue } from "./ref";
import { validateRequiredTimestamps } from "./timestamps";

export const validateItemValue = (
    item: CatalogItem,
    path: Array<string | number> = [],
): CatalogValidationResult<"item"> => {
    const result = createValidationResult("item");

    pushIssues(result, prefixIssues(validateRefValue(item.ref).issues, [...path, "ref"]));

    if (!isNonEmptyString(item.meta.name)) {
        pushIssues(result, catalogValidationIssues.itemNameRequired(path));
    }

    validateRequiredTimestamps(item.meta.createdAt, item.meta.updatedAt, result, [...path, "meta"]);

    if (!isPositiveFiniteNumber(item.layout.width)) {
        pushIssues(result, catalogValidationIssues.itemLayoutWidthInvalid(path));
    }

    if (!isPositiveFiniteNumber(item.layout.height)) {
        pushIssues(result, catalogValidationIssues.itemLayoutHeightInvalid(path));
    }

    item.modules.forEach((module, index) => {
        validateModuleValue(module, item.kind, result, [...path, "modules", index]);
    });

    return result;
};


