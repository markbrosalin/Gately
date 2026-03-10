import type {
    CatalogBundleDocument,
    CatalogDocument,
    CatalogLibraryDocument,
} from "@engine-model/catalog";
import type { Result } from "@engine-model";
import { CatalogExportService } from "./export";
import { CatalogImportService } from "./import";

export type CatalogImportDocumentResult = Result<CatalogDocument>;
export type CatalogImportLibraryResult = Result<CatalogLibraryDocument>;
export type CatalogImportBundleResult = Result<CatalogBundleDocument>;
export type CatalogExportDocumentResult = Result<CatalogDocument>;
export type CatalogExportLibraryResult = Result<CatalogLibraryDocument>;
export type CatalogExportBundleResult = Result<CatalogBundleDocument>;

export type CatalogIOService = CatalogExportService & CatalogImportService;
