import type { Issue } from "engine-model";

/** Clones serializable catalog payloads before crossing the IO boundary. */
export const cloneCatalogValue = <TValue>(value: TValue): TValue =>
    JSON.parse(JSON.stringify(value)) as TValue;

/** Prefixes nested IO issues with the parent path. */
export const prefixCatalogIOIssues = (issues: Issue[], prefix: Array<string | number>): Issue[] =>
    issues.map((issue) => ({
        ...issue,
        path: [...prefix, ...issue.path],
    }));
