import type { CatalogItem, CatalogItemRef } from "@engine-model/catalog";
import type { UseCase, Result } from "@engine-model";
import { createErrResult, createOkResult } from "@engine-model";
import { catalogUseCaseIssues } from "./issues";
import type { CatalogUseCaseDeps } from "./types";

type CatalogDeleteItemInput = {
    ref: CatalogItemRef;
};

type CatalogDeleteItemResult = Result<CatalogItem>;

export type CatalogDeleteItemUseCase = UseCase<CatalogDeleteItemInput, CatalogDeleteItemResult>;

export const createDeleteItemUseCase = ({
    query,
    state,
}: Pick<CatalogUseCaseDeps, "query" | "state">): CatalogDeleteItemUseCase => {
    return ({ ref }) => {
        const existingItem = query.getItem(ref);

        if (!existingItem) {
            return createErrResult(catalogUseCaseIssues.itemNotFound(["ref"], ref));
        }

        const dependentItem = query.getDependentItems(ref)[0];
        if (dependentItem) {
            return createErrResult(
                catalogUseCaseIssues.itemHasDependents(["ref"], ref, dependentItem.ref),
            );
        }

        const removedItem = state.removeItem(existingItem);

        if (!removedItem) {
            return createErrResult(catalogUseCaseIssues.itemNotFound(["ref"], ref));
        }

        return createOkResult(removedItem);
    };
};


