import type { CatalogItem } from "@engine-model/catalog";
import type { CatalogCreateItemInput } from "../services";
import type { Result, UseCase } from "@engine-model";
import { createErrResult, createOkResult } from "@engine-model";
import { catalogUseCaseIssues } from "./issues";
import type { CatalogUseCaseDeps } from "./types";

export type CatalogCreateItemUseCase = UseCase<CatalogCreateItemInput, Result<CatalogItem>>;

export const createItemUseCase = ({
    factory,
    query,
    state,
    validation,
}: Pick<
    CatalogUseCaseDeps,
    "factory" | "query" | "state" | "validation"
>): CatalogCreateItemUseCase => {
    return (input) => {
        const item = factory.createItem(input);
        const validationResult = validation.validateItem(item);

        if (!validationResult.ok) {
            return createErrResult(validationResult.issues);
        }

        if (!query.hasLibrary(item.ref.libraryId)) {
            return createErrResult(
                catalogUseCaseIssues.libraryNotFound(["ref", "libraryId"], item.ref.libraryId),
            );
        }

        if (query.hasItem(item.ref)) {
            return createErrResult(catalogUseCaseIssues.itemAlreadyExists(["ref"], item.ref));
        }

        return createOkResult(state.upsertItem(item));
    };
};


