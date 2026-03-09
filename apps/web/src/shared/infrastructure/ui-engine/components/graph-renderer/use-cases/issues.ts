import { createIssue } from "@gately/shared/infrastructure/ui-engine/model/core/issue";

export const graphRendererUseCaseIssueDefs = {
    rendererNotOpen: {
        code: "graph-renderer.use-case.renderer.not-open",
        message: () => "Graph renderer is not open.",
    },
    documentWorkspaceMismatch: {
        code: "graph-renderer.use-case.document.workspace-id.mismatch",
        message: ({
            expectedWorkspaceId,
            actualWorkspaceId,
        }: {
            expectedWorkspaceId: string;
            actualWorkspaceId: string;
        }) =>
            `Graph document workspace "${actualWorkspaceId}" does not match active workspace "${expectedWorkspaceId}".`,
    },
    documentContentJsonInvalid: {
        code: "graph-renderer.use-case.document.content-json.invalid",
        message: () => "Graph document contentJson is invalid.",
    },
} as const;

export const graphRendererUseCaseIssues = {
    rendererNotOpen: (path: Array<string | number>) =>
        createIssue(graphRendererUseCaseIssueDefs.rendererNotOpen, path),
    documentWorkspaceMismatch: (
        path: Array<string | number>,
        expectedWorkspaceId: string,
        actualWorkspaceId: string,
    ) =>
        createIssue(graphRendererUseCaseIssueDefs.documentWorkspaceMismatch, path, {
            expectedWorkspaceId,
            actualWorkspaceId,
        }),
    documentContentJsonInvalid: (path: Array<string | number>) =>
        createIssue(graphRendererUseCaseIssueDefs.documentContentJsonInvalid, path),
} as const;
