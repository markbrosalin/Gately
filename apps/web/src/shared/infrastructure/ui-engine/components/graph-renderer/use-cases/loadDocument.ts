import {
    createErrResult,
    createOkResult,
    type GraphDocument,
    type Result,
    type UseCase,
} from "@engine-model";
import { parseGraphRendererDocumentContentJson } from "../services/document";
import { graphRendererUseCaseIssues } from "./issues";
import type { GraphRendererUseCaseDeps } from "./types";

type GraphRendererLoadDocumentInput = {
    document: GraphDocument;
};

type GraphRendererLoadDocumentResult = Result<GraphDocument>;

export type GraphRendererLoadDocumentUseCase = UseCase<
    GraphRendererLoadDocumentInput,
    GraphRendererLoadDocumentResult
>;

export const createLoadDocumentUseCase = ({
    document,
    query,
}: Pick<GraphRendererUseCaseDeps, "document" | "query">): GraphRendererLoadDocumentUseCase => {
    return ({ document: nextDocument }) => {
        const activeWorkspaceId = query.activeWorkspaceId();
        if (!query.isOpen() || !activeWorkspaceId) {
            return createErrResult(graphRendererUseCaseIssues.rendererNotOpen([]));
        }

        if (nextDocument.workspaceId !== activeWorkspaceId) {
            return createErrResult(
                graphRendererUseCaseIssues.documentWorkspaceMismatch(
                    ["document", "workspaceId"],
                    activeWorkspaceId,
                    nextDocument.workspaceId,
                ),
            );
        }

        const parsedContent = parseGraphRendererDocumentContentJson(nextDocument.contentJson);
        if (!parsedContent.ok) {
            return createErrResult(
                graphRendererUseCaseIssues.documentContentJsonInvalid(["document", "contentJson"]),
            );
        }

        document.loadDocument({
            document: nextDocument,
            contentJson: parsedContent.value,
        });

        return createOkResult(nextDocument);
    };
};
