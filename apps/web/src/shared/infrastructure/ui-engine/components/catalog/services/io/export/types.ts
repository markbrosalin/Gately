import { CatalogBundleDocument } from "@engine-model/catalog";
import type { CatalogQueryService } from "../../query";
import type {
    CatalogExportBundleResult,
    CatalogExportDocumentResult,
    CatalogExportLibraryResult,
} from "../types";

export type CatalogExportServiceDeps = {
    query: CatalogQueryService;
};

export type CatalogExportLibraryArgs = {
    libraryId: string;
};

export type CatalogExportBundleArgs = {
    rootRefs: CatalogBundleDocument["rootRefs"];
};

export type CatalogExportService = {
    exportLibrary: (args: CatalogExportLibraryArgs) => CatalogExportLibraryResult;
    exportBundle: (args: CatalogExportBundleArgs) => CatalogExportBundleResult;
    exportDocument: () => CatalogExportDocumentResult;
};


