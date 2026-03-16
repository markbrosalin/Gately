import { createErrResult, createOkResult, type Result } from "@engine-model/core/result";
import type { UseCase } from "@engine-model/core/use-case";
import { graphRendererUseCaseIssues } from "./issues";
import type { GraphRendererUseCaseDeps } from "./types";

type GraphRendererRemoveNodeInput = {
    nodeId: string;
};

type GraphRendererRemoveNodeResult = Result;

export type GraphRendererRemoveNodeUseCase = UseCase<
    GraphRendererRemoveNodeInput,
    GraphRendererRemoveNodeResult
>;

export const createRemoveNodeUseCase = ({
    query,
    removal,
}: Pick<GraphRendererUseCaseDeps, "query" | "removal">): GraphRendererRemoveNodeUseCase => {
    return ({ nodeId }) => {
        if (!query.isMounted()) {
            return createErrResult(graphRendererUseCaseIssues.rendererNotOpen([]));
        }

        if (!removal.removeNode(nodeId)) {
            return createErrResult(graphRendererUseCaseIssues.nodeNotFound(["nodeId"], nodeId));
        }

        return createOkResult();
    };
};
