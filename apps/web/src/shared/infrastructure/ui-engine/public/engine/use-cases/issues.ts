import { createIssue } from "@engine-model/core/issue";

export const uiEngineUseCaseIssueDefs = {
    activeWorkspaceNotFound: {
        code: "ui-engine.use-case.workspace.active.not-found",
        message: () => "UI engine does not have an active workspace.",
    },
    catalogItemNotFound: {
        code: "ui-engine.use-case.catalog.item.not-found",
        message: ({ refKey }: { refKey: string }) => `Catalog item "${refKey}" was not found.`,
    },
    rendererNotReady: {
        code: "ui-engine.use-case.graph-renderer.not-ready",
        message: () => "UI engine graph renderer is not ready.",
    },
} as const;

export const uiEngineUseCaseIssues = {
    activeWorkspaceNotFound: (path: Array<string | number> = []) =>
        createIssue(uiEngineUseCaseIssueDefs.activeWorkspaceNotFound, path),
    catalogItemNotFound: (path: Array<string | number> = [], refKey: string) =>
        createIssue(uiEngineUseCaseIssueDefs.catalogItemNotFound, path, { refKey }),
    rendererNotReady: (path: Array<string | number> = []) =>
        createIssue(uiEngineUseCaseIssueDefs.rendererNotReady, path),
} as const;
