import { createIssue } from "@engine-model/core/issue";

export const graphDocumentUseCaseIssueDefs = {
    documentNotFound: {
        code: "graph-document.use-case.document.not-found",
        message: ({ workspaceId }: { workspaceId: string }) =>
            `Graph document for workspace "${workspaceId}" was not found.`,
    },
    importFormatVersionInvalid: {
        code: "graph-document.use-case.import.format-version.invalid",
        message: ({ formatVersion }: { formatVersion: number }) =>
            `Graph document format version "${formatVersion}" is not supported.`,
    },
} as const;

export const graphDocumentUseCaseIssues = {
    documentNotFound: (path: Array<string | number>, workspaceId: string) =>
        createIssue(graphDocumentUseCaseIssueDefs.documentNotFound, path, {
            workspaceId,
        }),
    importFormatVersionInvalid: (path: Array<string | number>, formatVersion: number) =>
        createIssue(graphDocumentUseCaseIssueDefs.importFormatVersionInvalid, path, {
            formatVersion,
        }),
} as const;


