import { createUninitializedGetter } from "@gately/shared/infrastructure/ui-engine/lib/registry";
import { buildCatalogServices } from "./services";
import { buildCatalogUseCases } from "./use-cases";
import type { CatalogApi, CatalogDeps } from "./types";

export const createCatalog = (deps: CatalogDeps): CatalogApi => {
    const services = buildCatalogServices({
        ...deps,
        getService: createUninitializedGetter("Catalog"),
    });
    const useCases = buildCatalogUseCases({
        factory: services.factory,
        io: services.io,
        query: services.query,
        state: services.state,
        validation: services.validation,
    });

    return {
        query: services.query,
        validateRef: services.validation.validateRef,
        validateItem: services.validation.validateItem,
        validateLibrary: services.validation.validateLibrary,
        validateDocument: services.validation.validateDocument,
        initCatalog: useCases.initCatalog,
        createLibrary: useCases.createLibrary,
        createItem: useCases.createItem,
        updateItem: useCases.updateItem,
        deleteItem: useCases.deleteItem,
        deleteLibrary: useCases.deleteLibrary,
        importBundle: useCases.importBundle,
        importLibrary: useCases.importLibrary,
        exportLibrary: useCases.exportLibrary,
        exportBundle: useCases.exportBundle,
        exportCatalog: useCases.exportCatalog,
    };
};

