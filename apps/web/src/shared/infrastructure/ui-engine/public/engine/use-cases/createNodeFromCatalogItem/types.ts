import type { Node } from "@antv/x6";
import type { CatalogItemRef } from "@engine-model/catalog";
import type { Result } from "@engine-model/core/result";
import type { UseCase } from "@engine-model/core/use-case";
import type { XYCoords } from "@gately/shared/types";
import type { UIEngineUseCaseDeps } from "../types";

export type UIEngineCreateNodeFromCatalogItemUseCaseInput = {
    ref: CatalogItemRef;
    position?: XYCoords;
};

export type UIEngineCreateNodeFromCatalogItemUseCaseResult = Result<Node>;
export type UIEngineCreateNodeFromCatalogItemUseCase = UseCase<
    UIEngineCreateNodeFromCatalogItemUseCaseInput,
    UIEngineCreateNodeFromCatalogItemUseCaseResult
>;

export type CreateNodeFromCatalogItemUseCaseDeps = Pick<
    UIEngineUseCaseDeps,
    "catalog" | "graphRenderer" | "workspace"
>;
