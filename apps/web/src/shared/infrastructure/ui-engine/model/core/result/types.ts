import { Issue } from "../issue";

type ResultValue<TValue> = [TValue] extends [void] ? { value?: undefined } : { value: TValue };

export type IssuesResult<TIssue extends Issue = Issue> = {
    ok: boolean;
    issues: TIssue[];
};

export type ValueIssuesResult<TValue, TIssue extends Issue = Issue> = IssuesResult<TIssue> & {
    value?: TValue;
};

export type OkResult<TValue = void, TIssue extends Issue = Issue> = {
    ok: true;
    issues: TIssue[];
} & ResultValue<TValue>;

export type ErrResult<TIssue extends Issue = Issue> = {
    ok: false;
    issues: TIssue[];
};

export type Result<TValue = void, TIssue extends Issue = Issue> =
    | OkResult<TValue, TIssue>
    | ErrResult<TIssue>;

export type SubjectIssuesResult<
    TSubject extends string,
    TIssue extends Issue = Issue,
> = IssuesResult<TIssue> & {
    subject: TSubject;
};

export type SubjectValueIssuesResult<
    TSubject extends string,
    TValue,
    TIssue extends Issue = Issue,
> = ValueIssuesResult<TValue, TIssue> & {
    subject: TSubject;
};

export type SubjectResult<
    TSubject extends string,
    TValue = void,
    TIssue extends Issue = Issue,
> = Result<TValue, TIssue> & {
    subject: TSubject;
};
