import { Timestamps } from "../core/entity";
import type { CatalogExtensions, CatalogItem } from "./item";

export const CATALOG_FORMAT_VERSION = 1 as const;

export type CatalogFormatVersion = typeof CATALOG_FORMAT_VERSION;

export type CatalogLibraryManifest = Timestamps & {
    id: string;
    name: string;
    version: string;
    description?: string;
    extensions?: CatalogExtensions;
};

export type CatalogLibraryDocument = {
    formatVersion: CatalogFormatVersion;
    manifest: CatalogLibraryManifest;
    items: CatalogItem[];
    extensions?: CatalogExtensions;
};

export type CatalogLibrarySummary = Pick<CatalogLibraryManifest, "id" | "name" | "version">;

export type CatalogDocument = {
    formatVersion: CatalogFormatVersion;
    libraries: CatalogLibraryDocument[];
    extensions?: CatalogExtensions;
};

