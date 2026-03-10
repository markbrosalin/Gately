import { createIssue } from "@engine-model/core/issue";

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
    nodeBuildInvalid: {
        code: "graph-renderer.use-case.node.build.invalid",
        message: ({ refKey, reason }: { refKey: string; reason: string }) =>
            `Graph node for catalog item "${refKey}" could not be built: ${reason}`,
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
    nodeBuildInvalid: (path: Array<string | number>, refKey: string, reason: string) =>
        createIssue(graphRendererUseCaseIssueDefs.nodeBuildInvalid, path, {
            refKey,
            reason,
        }),
} as const;


