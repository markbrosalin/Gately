import { createErrResult, createOkResult, type Result } from "@engine-model/core/result";
import type { UseCase } from "@engine-model/core/use-case";
import { graphRendererUseCaseIssues } from "./issues";
import type { GraphRendererUseCaseDeps } from "./types";

type GraphRendererRemoveSelectionResult = Result;

export type GraphRendererRemoveSelectionUseCase = UseCase<
    void,
    GraphRendererRemoveSelectionResult
>;

export const createRemoveSelectionUseCase = ({
    query,
    removal,
}: Pick<GraphRendererUseCaseDeps, "query" | "removal">): GraphRendererRemoveSelectionUseCase => {
    return () => {
        if (!query.isMounted()) {
            return createErrResult(graphRendererUseCaseIssues.rendererNotOpen([]));
        }

        removal.removeSelection();
        return createOkResult();
    };
};
