import type { CatalogItem } from "@engine-model/catalog";
import type { UseCase, Result } from "@engine-model";
import { createErrResult, createOkResult } from "@engine-model";
import { catalogUseCaseIssues } from "./issues";
import type { CatalogUseCaseDeps } from "./types";

type CatalogUpdateItemInput = {
    item: CatalogItem;
};

type CatalogUpdateItemResult = Result<CatalogItem>;

export type CatalogUpdateItemUseCase = UseCase<CatalogUpdateItemInput, CatalogUpdateItemResult>;

export const createUpdateItemUseCase = ({
    query,
    state,
    validation,
}: Pick<CatalogUseCaseDeps, "query" | "state" | "validation">): CatalogUpdateItemUseCase => {
    return ({ item }) => {
        const validationResult = validation.validateItem(item);

        if (!validationResult.ok) {
            return createErrResult(validationResult.issues);
        }

        if (!query.hasItem(item.ref)) {
            return createErrResult(catalogUseCaseIssues.itemNotFound(["ref"], item.ref));
        }

        return createOkResult(state.upsertItem(item));
    };
};


