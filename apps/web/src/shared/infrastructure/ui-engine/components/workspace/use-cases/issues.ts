import { createIssue } from "@engine-model/core/issue";

export const workspaceUseCaseIssueDefs = {
    logicEngineNotConfigured: {
        code: "workspace.use-case.logic-engine.not-configured",
        message: () => "Workspace logic engine is not configured.",
    },
    workspaceNotFound: {
        code: "workspace.use-case.workspace.not-found",
        message: ({ workspaceId }: { workspaceId: string }) =>
            `Workspace "${workspaceId}" was not found.`,
    },
    tabSessionNotFound: {
        code: "workspace.use-case.tab-session.not-found",
        message: ({ tabId }: { tabId: string }) => `Tab session "${tabId}" was not found.`,
    },
    tabCloseForbidden: {
        code: "workspace.use-case.tab.close-forbidden",
        message: ({ tabId }: { tabId: string }) => `Tab "${tabId}" cannot be closed.`,
    },
    tabAlreadyExists: {
        code: "workspace.use-case.tab.duplicate",
        message: ({ tabId }: { tabId: string }) => `Tab "${tabId}" already exists.`,
    },
    importRootWorkspaceMissing: {
        code: "workspace.use-case.import.root-workspace.missing",
        message: ({ rootWorkspaceId }: { rootWorkspaceId: string }) =>
            `Root workspace "${rootWorkspaceId}" is missing from the import document.`,
    },
    importRootWorkspaceInvalid: {
        code: "workspace.use-case.import.root-workspace.invalid",
        message: ({ rootWorkspaceId }: { rootWorkspaceId: string }) =>
            `Root workspace "${rootWorkspaceId}" must be a tab workspace.`,
    },
    importWorkspaceDuplicate: {
        code: "workspace.use-case.import.workspace.duplicate",
        message: ({ workspaceId }: { workspaceId: string }) =>
            `Workspace "${workspaceId}" is duplicated in the import document.`,
    },
    workspaceTitleRequired: {
        code: "workspace.use-case.workspace.title.required",
        message: () => "Workspace title is required.",
    },
} as const;

export const workspaceUseCaseIssues = {
    logicEngineNotConfigured: () =>
        createIssue(workspaceUseCaseIssueDefs.logicEngineNotConfigured, [
            "external",
            "logicEngine",
        ]),
    workspaceNotFound: (path: Array<string | number>, workspaceId: string) =>
        createIssue(workspaceUseCaseIssueDefs.workspaceNotFound, path, {
            workspaceId,
        }),
    tabSessionNotFound: (path: Array<string | number>, tabId: string) =>
        createIssue(workspaceUseCaseIssueDefs.tabSessionNotFound, path, {
            tabId,
        }),
    tabCloseForbidden: (path: Array<string | number>, tabId: string) =>
        createIssue(workspaceUseCaseIssueDefs.tabCloseForbidden, path, {
            tabId,
        }),
    tabAlreadyExists: (path: Array<string | number>, tabId: string) =>
        createIssue(workspaceUseCaseIssueDefs.tabAlreadyExists, path, {
            tabId,
        }),
    importRootWorkspaceMissing: (path: Array<string | number>, rootWorkspaceId: string) =>
        createIssue(workspaceUseCaseIssueDefs.importRootWorkspaceMissing, path, {
            rootWorkspaceId,
        }),
    importRootWorkspaceInvalid: (path: Array<string | number>, rootWorkspaceId: string) =>
        createIssue(workspaceUseCaseIssueDefs.importRootWorkspaceInvalid, path, {
            rootWorkspaceId,
        }),
    importWorkspaceDuplicate: (path: Array<string | number>, workspaceId: string) =>
        createIssue(workspaceUseCaseIssueDefs.importWorkspaceDuplicate, path, {
            workspaceId,
        }),
    workspaceTitleRequired: (path: Array<string | number>) =>
        createIssue(workspaceUseCaseIssueDefs.workspaceTitleRequired, path),
} as const;


