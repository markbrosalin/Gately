import type { CatalogDocument } from "@gately/shared/infrastructure/ui-engine/model/catalog";
import type { UseCase, Result } from "../../../model";
import { createErrResult, createOkResult } from "../../../model";
import type { CatalogUseCaseDeps } from "./types";

type CatalogExportCatalogResult = Result<CatalogDocument>;

export type CatalogExportCatalogUseCase = UseCase<void, CatalogExportCatalogResult>;

export const createExportCatalogUseCase = ({
    io,
}: Pick<CatalogUseCaseDeps, "io">): CatalogExportCatalogUseCase => {
    return () => {
        const exportResult = io.exportDocument();

        if (!exportResult.ok || !exportResult.value) {
            return createErrResult(exportResult.issues);
        }

        return createOkResult(exportResult.value);
    };
};
