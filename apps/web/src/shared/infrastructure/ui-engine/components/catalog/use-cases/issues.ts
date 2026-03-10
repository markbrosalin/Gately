import type { CatalogItemRef } from "@engine-model/catalog";
import { createIssue } from "@engine-model/core/issue";
import { createCatalogItemRefKey } from "@engine-model/catalog/lib";

export const catalogUseCaseIssueDefs = {
    libraryAlreadyExists: {
        code: "catalog.use-case.library.duplicate",
        message: ({ libraryId }: { libraryId: string }) =>
            `Library "${libraryId}" already exists in the catalog.`,
    },
    libraryNotFound: {
        code: "catalog.use-case.library.not-found",
        message: ({ libraryId }: { libraryId: string }) => `Library "${libraryId}" was not found.`,
    },
    itemAlreadyExists: {
        code: "catalog.use-case.item.duplicate",
        message: ({ refKey }: { refKey: string }) =>
            `Item "${refKey}" already exists in the catalog.`,
    },
    itemNotFound: {
        code: "catalog.use-case.item.not-found",
        message: ({ refKey }: { refKey: string }) => `Item "${refKey}" was not found.`,
    },
    itemHasDependents: {
        code: "catalog.use-case.item.has-dependents",
        message: ({ refKey, dependentRefKey }: { refKey: string; dependentRefKey: string }) =>
            `Item "${refKey}" cannot be deleted because it is used by "${dependentRefKey}".`,
    },
    libraryHasDependents: {
        code: "catalog.use-case.library.has-dependents",
        message: ({ libraryId, dependentRefKey }: { libraryId: string; dependentRefKey: string }) =>
            `Library "${libraryId}" cannot be deleted because "${dependentRefKey}" depends on one of its items.`,
    },
} as const;

export const catalogUseCaseIssues = {
    libraryAlreadyExists: (path: Array<string | number>, libraryId: string) =>
        createIssue(catalogUseCaseIssueDefs.libraryAlreadyExists, path, {
            libraryId,
        }),
    libraryNotFound: (path: Array<string | number>, libraryId: string) =>
        createIssue(catalogUseCaseIssueDefs.libraryNotFound, path, {
            libraryId,
        }),
    itemAlreadyExists: (path: Array<string | number>, ref: CatalogItemRef) =>
        createIssue(catalogUseCaseIssueDefs.itemAlreadyExists, path, {
            refKey: createCatalogItemRefKey(ref),
        }),
    itemNotFound: (path: Array<string | number>, ref: CatalogItemRef) =>
        createIssue(catalogUseCaseIssueDefs.itemNotFound, path, {
            refKey: createCatalogItemRefKey(ref),
        }),
    itemHasDependents: (
        path: Array<string | number>,
        ref: CatalogItemRef,
        dependentRef: CatalogItemRef,
    ) =>
        createIssue(catalogUseCaseIssueDefs.itemHasDependents, path, {
            refKey: createCatalogItemRefKey(ref),
            dependentRefKey: createCatalogItemRefKey(dependentRef),
        }),
    libraryHasDependents: (
        path: Array<string | number>,
        libraryId: string,
        dependentRef: CatalogItemRef,
    ) =>
        createIssue(catalogUseCaseIssueDefs.libraryHasDependents, path, {
            libraryId,
            dependentRefKey: createCatalogItemRefKey(dependentRef),
        }),
} as const;
