import type { CatalogLibraryDocument } from "engine-model/catalog";
import type { CatalogExportLibraryOptions } from "../services";
import type { UseCase, Result } from "engine-model";
import { createErrResult, createOkResult } from "engine-model";
import type { CatalogUseCaseDeps } from "./types";

type CatalogExportLibraryResult = Result<CatalogLibraryDocument>;

export type CatalogExportLibraryUseCase = UseCase<
    CatalogExportLibraryOptions,
    CatalogExportLibraryResult
>;

export const createExportLibraryUseCase = ({
    io,
}: Pick<CatalogUseCaseDeps, "io">): CatalogExportLibraryUseCase => {
    return (input) => {
        const exportResult = io.exportLibrary(input);

        if (!exportResult.ok || !exportResult.value) {
            return createErrResult(exportResult.issues);
        }

        return createOkResult(exportResult.value);
    };
};
