import type { Node } from "@antv/x6";
import { createCatalogItemRefKey } from "@engine-model/catalog/lib";
import { createErrResult, createOkResult, type Result } from "@engine-model/core/result";
import { uiEngineUseCaseIssues } from "../issues";
import type {
    CreateNodeFromCatalogItemUseCaseDeps,
    UIEngineCreateNodeFromCatalogItemUseCase,
    UIEngineCreateNodeFromCatalogItemUseCaseInput,
} from "./types";

export const createCreateNodeFromCatalogItemUseCase = ({
    catalog,
    graphRenderer,
    workspace,
}: CreateNodeFromCatalogItemUseCaseDeps): UIEngineCreateNodeFromCatalogItemUseCase => {
    return ({ ref, position }: UIEngineCreateNodeFromCatalogItemUseCaseInput): Result<Node> => {
        const item = catalog.query.getItem(ref);
        if (!item) {
            return createErrResult(
                uiEngineUseCaseIssues.catalogItemNotFound(["ref"], createCatalogItemRefKey(ref)),
            );
        }

        const activeWorkspaceId = workspace.query.activeWorkspaceId();
        if (!activeWorkspaceId) {
            return createErrResult(uiEngineUseCaseIssues.activeWorkspaceNotFound());
        }

        if (!graphRenderer.query.isMounted()) {
            return createErrResult(uiEngineUseCaseIssues.rendererNotReady());
        }

        const createNodeResult = graphRenderer.createNode({
            item,
            position,
        });
        if (!createNodeResult.ok || !createNodeResult.value) {
            return createErrResult(createNodeResult.issues);
        }

        return createOkResult(createNodeResult.value);
    };
};
