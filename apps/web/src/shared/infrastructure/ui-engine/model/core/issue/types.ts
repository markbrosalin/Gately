export type IssuePath = Array<string | number>;

export type Issue = {
    code: string;
    message: string;
    path: IssuePath;
};

export type IssueDefinition<TParams = void> = {
    code: string;
    message: string | ((params: TParams) => string);
};

