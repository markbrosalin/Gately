import type {
    Issue,
    SubjectIssuesResult,
    SubjectValueIssuesResult,
} from "@gately/shared/infrastructure/ui-engine/model";
import { createErrResult, createOkResult } from "@gately/shared/infrastructure/ui-engine/model";

/** Clones serializable catalog payloads before crossing the IO boundary. */
export const cloneCatalogValue = <TValue>(value: TValue): TValue =>
    JSON.parse(JSON.stringify(value)) as TValue;

/** Creates a normalized IO result for import/export operations. */
export const createCatalogIOResult = <TSubject extends string, TValue>(
    subject: TSubject,
    value?: TValue,
    issues: Issue[] = [],
): SubjectValueIssuesResult<TSubject, TValue> => {
    const base: SubjectIssuesResult<TSubject, Issue> =
        issues.length > 0
            ? {
                  ...createErrResult(issues),
                  subject,
              }
            : {
                  ...createOkResult(),
                  subject,
              };

    if (value === undefined) {
        return base as SubjectValueIssuesResult<TSubject, TValue>;
    }

    return {
        ...base,
        value,
    };
};

/** Prefixes nested IO issues with the parent path. */
export const prefixCatalogIOIssues = (issues: Issue[], prefix: Array<string | number>): Issue[] =>
    issues.map((issue) => ({
        ...issue,
        path: [...prefix, ...issue.path],
    }));
