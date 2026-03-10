import type { CatalogLibraryDocument } from "@engine-model/catalog";
import type { UseCase, Result } from "@engine-model";
import { createErrResult, createOkResult } from "@engine-model";
import { mergeLibraryDocuments } from "./helpers/mergeLibraryDocuments";
import type { CatalogImportStrategy, CatalogUseCaseDeps } from "./types";

type CatalogImportLibraryInput = {
    library: CatalogLibraryDocument;
    strategy?: CatalogImportStrategy;
};

type CatalogImportLibraryResult = Result<CatalogLibraryDocument>;

export type CatalogImportLibraryUseCase = UseCase<
    CatalogImportLibraryInput,
    CatalogImportLibraryResult
>;

const DEFAULT_APPLY_STRATEGY: CatalogImportStrategy = "merge";

export const createImportLibraryUseCase = ({
    io,
    query,
    state,
}: Pick<CatalogUseCaseDeps, "io" | "query" | "state">): CatalogImportLibraryUseCase => {
    return ({ library, strategy = DEFAULT_APPLY_STRATEGY }) => {
        const importResult = io.importLibrary(library);
        if (!importResult.ok || !importResult.value) {
            return createErrResult(importResult.issues);
        }

        const importedLibrary = importResult.value;
        const currentLibrary = query.getLibrary(importedLibrary.manifest.id);
        const nextLibrary =
            strategy === "replace" || !currentLibrary
                ? importedLibrary
                : mergeLibraryDocuments(currentLibrary, importedLibrary);

        return createOkResult(state.upsertLibrary(nextLibrary));
    };
};


