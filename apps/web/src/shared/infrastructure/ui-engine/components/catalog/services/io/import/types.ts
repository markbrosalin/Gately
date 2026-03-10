import type {
    CatalogBundleDocument,
    CatalogDocument,
    CatalogLibraryDocument,
} from "@engine-model/catalog";
import type { CatalogValidationService } from "../../validation";
import type {
    CatalogImportDocumentResult,
    CatalogImportBundleResult,
    CatalogImportLibraryResult,
} from "../types";

export type CatalogImportServiceDeps = {
    validation: CatalogValidationService;
};

export type CatalogImportService = {
    importLibrary: (library: CatalogLibraryDocument) => CatalogImportLibraryResult;
    importDocument: (document: CatalogDocument) => CatalogImportDocumentResult;
    importBundle: (bundle: CatalogBundleDocument) => CatalogImportBundleResult;
};
