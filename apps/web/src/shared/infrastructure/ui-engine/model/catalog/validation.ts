import { SubjectIssuesResult } from "../core";
import type { Issue } from "../core/issue";

export type CatalogValidationResult<TSubject extends string = string> = SubjectIssuesResult<
    TSubject,
    Issue
>;

