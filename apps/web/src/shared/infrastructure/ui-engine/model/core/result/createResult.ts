import { Issue } from "../issue";
import type { ErrResult, OkResult } from "./types";

export const createOkResult = <TValue = void, TIssue extends Issue = Issue>(
    value: TValue | undefined = undefined,
): OkResult<TValue, TIssue> => {
    return {
        ok: true,
        issues: [],
        value,
    } as unknown as OkResult<TValue, TIssue>;
};

export const createErrResult = <TIssue extends Issue = Issue>(
    issues: TIssue | TIssue[] = [],
): ErrResult<TIssue> => ({
    ok: false,
    issues: Array.isArray(issues) ? issues : [issues],
});

