import type { CatalogServiceContext } from "../types";
import { createCatalogExportService } from "./export";
import { createCatalogImportService } from "./import";
import type { CatalogIOService } from "./types";

/** Combines import/export flows for catalog documents without mutating state. */
export const createCatalogIOService = (ctx: CatalogServiceContext): CatalogIOService => {
    const importService = createCatalogImportService({
        validation: ctx.getService("validation"),
    });
    const exportService = createCatalogExportService({
        query: ctx.getService("query"),
    });

    return {
        importLibrary: importService.importLibrary,
        importDocument: importService.importDocument,
        importBundle: importService.importBundle,
        exportLibrary: exportService.exportLibrary,
        exportBundle: exportService.exportBundle,
        exportDocument: exportService.exportDocument,
    };
};

