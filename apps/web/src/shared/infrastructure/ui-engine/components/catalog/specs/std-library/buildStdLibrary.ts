import {
    CATALOG_FORMAT_VERSION,
    CatalogLibraryDocument,
    DEFAULT_LIBRARY_VERSION,
} from "@gately/shared/infrastructure/ui-engine/model/catalog";
import { LOGIC_ITEMS } from "./logic";

export const buildStdLibrary = (): CatalogLibraryDocument => ({
    formatVersion: CATALOG_FORMAT_VERSION,
    manifest: {
        id: "std",
        name: "Standard Library",
        version: DEFAULT_LIBRARY_VERSION,
        description: "Built-in library of standard elements for circuit design and visualization.",
        createdAt: 1,
        extensions: {
            i18nKey: "catalog.std",
        },
    },
    items: [...LOGIC_ITEMS],
});

