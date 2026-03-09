import {
    CATALOG_FORMAT_VERSION,
    type CatalogDocument,
} from "engine-model/catalog";

export const createCatalogDocument = (
    overrides: Partial<CatalogDocument> = {},
): CatalogDocument => ({
    formatVersion: CATALOG_FORMAT_VERSION,
    libraries: [],
    ...overrides,
});
