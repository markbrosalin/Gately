import type { Issue, IssueDefinition, IssuePath } from "./types";

/**
 * Builds a normalized issue from a reusable definition.
 */
export const createIssue = <TParams = void>(
    definition: IssueDefinition<TParams>,
    path: IssuePath,
    ...params: TParams extends void ? [] : [TParams]
): Issue => {
    const message =
        typeof definition.message === "function"
            ? definition.message(params[0] as TParams)
            : definition.message;

    return {
        code: definition.code,
        message,
        path,
    };
};

