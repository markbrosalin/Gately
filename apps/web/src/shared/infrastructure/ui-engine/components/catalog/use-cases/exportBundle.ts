import type { CatalogBundleDocument } from "@gately/shared/infrastructure/ui-engine/model/catalog";
import type { CatalogExportBundleOptions } from "../services";
import type { UseCase, Result } from "../../../model";
import { createErrResult, createOkResult } from "../../../model";
import type { CatalogUseCaseDeps } from "./types";

type CatalogExportBundleResult = Result<CatalogBundleDocument>;

export type CatalogExportBundleUseCase = UseCase<
    CatalogExportBundleOptions,
    CatalogExportBundleResult
>;

export const createExportBundleUseCase = ({
    io,
}: Pick<CatalogUseCaseDeps, "io">): CatalogExportBundleUseCase => {
    return (input) => {
        const exportResult = io.exportBundle(input);

        if (!exportResult.ok || !exportResult.value) {
            return createErrResult(exportResult.issues);
        }

        return createOkResult(exportResult.value);
    };
};
