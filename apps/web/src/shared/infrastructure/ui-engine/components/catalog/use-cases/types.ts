import type { CatalogCreateItemUseCase } from "./createItem";
import type { CatalogCreateLibraryUseCase } from "./createLibrary";
import type { CatalogDeleteLibraryUseCase } from "./deleteLibrary";
import type { CatalogDeleteItemUseCase } from "./deleteItem";
import type { CatalogExportBundleUseCase } from "./exportBundle";
import type { CatalogExportCatalogUseCase } from "./exportCatalog";
import type { CatalogExportLibraryUseCase } from "./exportLibrary";
import type { CatalogInitCatalogUseCase } from "./initCatalog";
import type { CatalogImportBundleUseCase } from "./importBundle";
import type { CatalogImportLibraryUseCase } from "./importLibrary";
import type { CatalogUpdateItemUseCase } from "./updateItem";
import { CatalogServices } from "../services";

export type CatalogImportStrategy = "merge" | "replace";

export type CatalogUseCaseDeps = CatalogServices;

export type CatalogUseCases = {
    initCatalog: CatalogInitCatalogUseCase;
    createLibrary: CatalogCreateLibraryUseCase;
    createItem: CatalogCreateItemUseCase;
    updateItem: CatalogUpdateItemUseCase;
    deleteItem: CatalogDeleteItemUseCase;
    deleteLibrary: CatalogDeleteLibraryUseCase;
    importLibrary: CatalogImportLibraryUseCase;
    importBundle: CatalogImportBundleUseCase;
    exportLibrary: CatalogExportLibraryUseCase;
    exportBundle: CatalogExportBundleUseCase;
    exportCatalog: CatalogExportCatalogUseCase;
};

