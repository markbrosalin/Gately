import { createErrResult, createOkResult, type Result } from "@engine-model/core/result";
import type { UseCase } from "@engine-model/core/use-case";
import { graphRendererUseCaseIssues } from "./issues";
import type { GraphRendererUseCaseDeps } from "./types";

type GraphRendererRemoveEdgeInput = {
    edgeId: string;
};

type GraphRendererRemoveEdgeResult = Result;

export type GraphRendererRemoveEdgeUseCase = UseCase<
    GraphRendererRemoveEdgeInput,
    GraphRendererRemoveEdgeResult
>;

export const createRemoveEdgeUseCase = ({
    query,
    removal,
}: Pick<GraphRendererUseCaseDeps, "query" | "removal">): GraphRendererRemoveEdgeUseCase => {
    return ({ edgeId }) => {
        if (!query.isOpen()) {
            return createErrResult(graphRendererUseCaseIssues.rendererNotOpen([]));
        }

        if (!removal.removeEdge(edgeId)) {
            return createErrResult(graphRendererUseCaseIssues.edgeNotFound(["edgeId"], edgeId));
        }

        return createOkResult();
    };
};
