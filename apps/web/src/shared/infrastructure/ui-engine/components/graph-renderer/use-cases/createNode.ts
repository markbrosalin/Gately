import type { CatalogItem } from "@engine-model/catalog";
import type { Node } from "@antv/x6";
import { createErrResult, createOkResult, type Result } from "@engine-model/core/result";
import type { UseCase } from "@engine-model/core/use-case";
import { createCatalogItemRefKey } from "@engine-model/catalog/lib";
import { GraphRendererBuilderError, type GraphRendererNodePosition } from "../services/builder";
import { graphRendererUseCaseIssues } from "./issues";
import type { GraphRendererUseCaseDeps } from "./types";

type GraphRendererCreateNodeInput = {
    item: CatalogItem;
    position?: GraphRendererNodePosition;
};

type GraphRendererCreateNodeResult = Result<Node>;

export type GraphRendererCreateNodeUseCase = UseCase<
    GraphRendererCreateNodeInput,
    GraphRendererCreateNodeResult
>;

export const createCreateNodeUseCase = ({
    builder,
    nodes,
    query,
}: Pick<
    GraphRendererUseCaseDeps,
    "builder" | "nodes" | "query"
>): GraphRendererCreateNodeUseCase => {
    return (input) => {
        if (!query.isOpen()) {
            return createErrResult(graphRendererUseCaseIssues.rendererNotOpen([]));
        }

        try {
            const props = builder.buildNodeProps(input);
            return createOkResult(nodes.createNode(props));
        } catch (error) {
            if (error instanceof GraphRendererBuilderError) {
                return createErrResult(
                    graphRendererUseCaseIssues.nodeBuildInvalid(
                        ["item"],
                        createCatalogItemRefKey(input.item.ref),
                        error.message,
                    ),
                );
            }

            throw error;
        }
    };
};


