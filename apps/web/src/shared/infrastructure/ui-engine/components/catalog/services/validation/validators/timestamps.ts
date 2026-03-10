import { catalogValidationIssues } from "../issues";
import { isPositiveFiniteNumber, pushIssues } from "../helpers";
import type { CatalogValidationResult } from "@engine-model/catalog";

export const validateRequiredTimestamps = (
    createdAt: unknown,
    updatedAt: unknown,
    result: CatalogValidationResult,
    path: Array<string | number>,
): void => {
    if (!isPositiveFiniteNumber(createdAt)) {
        pushIssues(result, catalogValidationIssues.createdAtInvalid(path));
    }

    if (updatedAt !== undefined && !isPositiveFiniteNumber(updatedAt)) {
        pushIssues(result, catalogValidationIssues.updatedAtInvalid(path));
    }
};

export const validateOptionalTimestamps = (
    createdAt: unknown,
    updatedAt: unknown,
    result: CatalogValidationResult,
    path: Array<string | number>,
): void => {
    if (createdAt !== undefined && !isPositiveFiniteNumber(createdAt)) {
        pushIssues(result, catalogValidationIssues.createdAtInvalid(path));
    }

    if (updatedAt !== undefined && !isPositiveFiniteNumber(updatedAt)) {
        pushIssues(result, catalogValidationIssues.updatedAtInvalid(path));
    }
};


