import { ComponentDeps } from "@engine-model";
import * as Services from "./services";
import type {
    CatalogCreateItemUseCase,
    CatalogCreateLibraryUseCase,
    CatalogDeleteLibraryUseCase,
    CatalogDeleteItemUseCase,
    CatalogExportBundleUseCase,
    CatalogExportCatalogUseCase,
    CatalogExportLibraryUseCase,
    CatalogImportBundleUseCase,
    CatalogImportLibraryUseCase,
    CatalogInitCatalogUseCase,
    CatalogUpdateItemUseCase,
} from "./use-cases";

export type CatalogExternal = {};

export type CatalogDeps = ComponentDeps<CatalogExternal>;

export type CatalogApi = Services.CatalogValidationService & {
    query: Services.CatalogQueryService;
    initCatalog: CatalogInitCatalogUseCase;
    createLibrary: CatalogCreateLibraryUseCase;
    createItem: CatalogCreateItemUseCase;
    updateItem: CatalogUpdateItemUseCase;
    deleteItem: CatalogDeleteItemUseCase;
    deleteLibrary: CatalogDeleteLibraryUseCase;
    importBundle: CatalogImportBundleUseCase;
    importLibrary: CatalogImportLibraryUseCase;
    exportLibrary: CatalogExportLibraryUseCase;
    exportBundle: CatalogExportBundleUseCase;
    exportCatalog: CatalogExportCatalogUseCase;
};


