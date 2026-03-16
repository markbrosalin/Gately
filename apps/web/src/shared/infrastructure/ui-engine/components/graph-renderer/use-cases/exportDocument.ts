import {
    createErrResult,
    createOkResult,
    type Result,
} from "@engine-model/core/result";
import type { UseCase } from "@engine-model/core/use-case";
import type { GraphDocument } from "@engine-model/graph-document";
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
        if (!query.isMounted() || !activeWorkspaceId) {
            return createErrResult(graphRendererUseCaseIssues.rendererNotOpen([]));
        }

        return createOkResult(document.exportDocument(activeWorkspaceId));
    };
};


