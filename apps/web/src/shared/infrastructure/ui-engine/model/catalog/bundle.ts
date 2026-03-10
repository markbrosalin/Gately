import type {
    CatalogExtensions,
    CatalogItem,
} from "./item";
import type {
    CatalogFormatVersion,
    CatalogLibraryManifest,
} from "./library";
import type { CatalogItemRef } from "./ref";

/**
 * A partial library payload used inside a catalog bundle.
 * Unlike CatalogLibraryDocument, it may contain only the item slice
 * required by the exported roots and their dependencies.
 */
export type CatalogBundleLibrary = {
    manifest: CatalogLibraryManifest;
    items: CatalogItem[];
    extensions?: CatalogExtensions;
};

/**
 * A shareable slice of the catalog rooted at one or more items.
 * It keeps root refs plus the minimal library fragments needed to resolve them.
 */
export type CatalogBundleDocument = {
    formatVersion: CatalogFormatVersion;
    rootRefs: CatalogItemRef[];
    libraries: CatalogBundleLibrary[];
    extensions?: CatalogExtensions;
};

