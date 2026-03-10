import { createItemUseCase } from "./createItem";
import { createLibraryUseCase } from "./createLibrary";
import { createDeleteLibraryUseCase } from "./deleteLibrary";
import { createDeleteItemUseCase } from "./deleteItem";
import { createExportBundleUseCase } from "./exportBundle";
import { createExportCatalogUseCase } from "./exportCatalog";
import { createExportLibraryUseCase } from "./exportLibrary";
import { createInitCatalogUseCase } from "./initCatalog";
import { createImportBundleUseCase } from "./importBundle";
import { createImportLibraryUseCase } from "./importLibrary";
import { createUpdateItemUseCase } from "./updateItem";
import type { CatalogUseCaseDeps, CatalogUseCases } from "./types";

export const buildCatalogUseCases = (deps: CatalogUseCaseDeps): CatalogUseCases => {
    return {
        initCatalog: createInitCatalogUseCase(deps),
        createLibrary: createLibraryUseCase(deps),
        createItem: createItemUseCase(deps),
        updateItem: createUpdateItemUseCase(deps),
        deleteItem: createDeleteItemUseCase(deps),
        deleteLibrary: createDeleteLibraryUseCase(deps),
        importLibrary: createImportLibraryUseCase(deps),
        importBundle: createImportBundleUseCase(deps),
        exportLibrary: createExportLibraryUseCase(deps),
        exportBundle: createExportBundleUseCase(deps),
        exportCatalog: createExportCatalogUseCase(deps),
    };
};

