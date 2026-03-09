import { createOkResult } from "engine-model";
import type {
    CatalogValidationResult,
} from "engine-model/catalog";
import type { Issue } from "engine-model";

export const createValidationResult = <TSubject extends string>(
    subject: TSubject,
): CatalogValidationResult<TSubject> => ({
    ...createOkResult(),
    subject,
});

export const pushIssues = (
    result: CatalogValidationResult,
    issues: Issue | Issue[],
): void => {
    const array = Array.isArray(issues) ? issues : [issues];
    if (array.length === 0) return;

    result.ok = false;
    result.issues = [...result.issues, ...array];
};

export const prefixIssues = (
    issues: Issue[],
    prefix: Array<string | number>,
): Issue[] => {
    return issues.map((issue) => ({
        ...issue,
        path: [...prefix, ...issue.path],
    }));
};
