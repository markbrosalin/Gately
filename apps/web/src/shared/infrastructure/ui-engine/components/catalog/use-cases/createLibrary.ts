import type { CatalogLibraryDocument } from "@engine-model/catalog";
import type { CatalogCreateLibraryInput } from "../services";
import type { Result, UseCase } from "@engine-model";
import { createErrResult, createOkResult } from "@engine-model";
import { catalogUseCaseIssues } from "./issues";
import type { CatalogUseCaseDeps } from "./types";

type CatalogCreateLibraryResult = Result<CatalogLibraryDocument>;

export type CatalogCreateLibraryUseCase = UseCase<
    CatalogCreateLibraryInput,
    CatalogCreateLibraryResult
>;

export const createLibraryUseCase = ({
    factory,
    query,
    state,
    validation,
}: Pick<
    CatalogUseCaseDeps,
    "factory" | "query" | "state" | "validation"
>): CatalogCreateLibraryUseCase => {
    return (input) => {
        const library = factory.createLibrary(input);
        const validationResult = validation.validateLibrary(library);

        if (!validationResult.ok) {
            return createErrResult(validationResult.issues);
        }

        if (query.hasLibrary(library.manifest.id)) {
            return createErrResult(
                catalogUseCaseIssues.libraryAlreadyExists(["manifest", "id"], library.manifest.id),
            );
        }

        return createOkResult(state.upsertLibrary(library));
    };
};
