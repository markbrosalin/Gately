import type { CatalogItem, CatalogLibraryDocument } from "@engine-model/catalog";
import type { Result, UseCase } from "@engine-model";
import { createErrResult, createOkResult } from "@engine-model";
import { createCatalogItemRefKey } from "@engine-model/catalog/lib";
import { catalogUseCaseIssues } from "./issues";
import type { CatalogUseCaseDeps } from "./types";

type CatalogDeleteLibraryInput = {
    libraryId: string;
};

type CatalogDeleteLibraryResult = Result<CatalogLibraryDocument>;

export type CatalogDeleteLibraryUseCase = UseCase<
    CatalogDeleteLibraryInput,
    CatalogDeleteLibraryResult
>;

export const createDeleteLibraryUseCase = ({
    query,
    state,
}: Pick<CatalogUseCaseDeps, "query" | "state">): CatalogDeleteLibraryUseCase => {
    return ({ libraryId }) => {
        const library = query.getLibrary(libraryId);
        if (!library) {
            return createErrResult(catalogUseCaseIssues.libraryNotFound(["libraryId"], libraryId));
        }

        const externalDependentItems = new Map<string, CatalogItem>();

        library.items.forEach((item) => {
            query.getDependentItems(item.ref).forEach((dependentItem) => {
                if (dependentItem.ref.libraryId === libraryId) {
                    return;
                }

                externalDependentItems.set(
                    createCatalogItemRefKey(dependentItem.ref),
                    dependentItem,
                );
            });
        });

        const externalDependentItem = [...externalDependentItems.values()][0];
        if (externalDependentItem) {
            return createErrResult(
                catalogUseCaseIssues.libraryHasDependents(
                    ["libraryId"],
                    libraryId,
                    externalDependentItem.ref,
                ),
            );
        }

        const removedLibrary = state.removeLibrary(libraryId);

        if (!removedLibrary) {
            return createErrResult(catalogUseCaseIssues.libraryNotFound(["libraryId"], libraryId));
        }

        return createOkResult(removedLibrary);
    };
};
