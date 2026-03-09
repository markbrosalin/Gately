import type { GraphDocument } from "@gately/shared/infrastructure/ui-engine/model";
import type { UseCase, Result } from "../../../model";
import { createErrResult, createOkResult } from "../../../model";
import { graphRendererUseCaseIssues } from "./issues";
import type { GraphRendererUseCaseDeps } from "./types";

type GraphRendererExportDocumentResult = Result<GraphDocument>;

export type GraphRendererExportDocumentUseCase = UseCase<void, GraphRendererExportDocumentResult>;

export const createExportDocumentUseCase = ({
    document,
    query,
}: Pick<GraphRendererUseCaseDeps, "document" | "query">): GraphRendererExportDocumentUseCase => {
    return () => {
        const activeWorkspaceId = query.activeWorkspaceId();
        if (!query.isOpen() || !activeWorkspaceId) {
            return createErrResult(graphRendererUseCaseIssues.rendererNotOpen([]));
        }

        return createOkResult(document.exportDocument(activeWorkspaceId));
    };
};
