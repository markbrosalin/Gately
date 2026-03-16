import type { Node } from "@antv/x6";
import type { CatalogItemRef } from "@engine-model/catalog";
import type { Result } from "@engine-model/core/result";
import type { UseCase } from "@engine-model/core/use-case";
import type { XYCoords } from "@gately/shared/types";
import type { UseCaseDeps } from "../types";

export type EngineCreateNodeFromCatalogItemUseCaseInput = {
    ref: CatalogItemRef;
    position?: XYCoords;
};

export type EngineCreateNodeFromCatalogItemUseCaseResult = Result<Node>;
export type EngineCreateNodeFromCatalogItemUseCase = UseCase<
    EngineCreateNodeFromCatalogItemUseCaseInput,
    EngineCreateNodeFromCatalogItemUseCaseResult
>;

export type CreateNodeFromCatalogItemUseCaseDeps = Pick<
    UseCaseDeps,
    "catalog" | "graphRenderer" | "workspace"
>;
