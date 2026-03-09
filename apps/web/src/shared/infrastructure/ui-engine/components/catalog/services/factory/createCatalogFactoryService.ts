import type {
    CatalogLibraryDocument,
} from "engine-model/catalog";
import {
    CATALOG_FORMAT_VERSION,
    CatalogItem,
} from "engine-model/catalog";
import { DEFAULT_LIBRARY_VERSION } from "./constants";
import { createItemByKind, createTimestamps } from "./helpers";
import type {
    CatalogFactoryService,
    CatalogCreateItemInput,
    CatalogCreateLibraryInput,
} from "./types";

/** Creates normalized catalog entities without mutating catalog state. */
export const createCatalogFactoryService = (): CatalogFactoryService => {
    const createLibrary = (input: CatalogCreateLibraryInput): CatalogLibraryDocument => {
        const timestamps = createTimestamps();

        return {
            formatVersion: CATALOG_FORMAT_VERSION,
            manifest: {
                id: input.id,
                name: input.name,
                version: input.version ?? DEFAULT_LIBRARY_VERSION,
                ...timestamps,
                ...(input.description !== undefined ? { description: input.description } : {}),
                ...(input.manifestExtensions !== undefined
                    ? { extensions: input.manifestExtensions }
                    : {}),
            },
            items: input.items ?? [],
            ...(input.extensions !== undefined ? { extensions: input.extensions } : {}),
        };
    };

    const createItem = (input: CatalogCreateItemInput): CatalogItem => {
        return createItemByKind(input);
    };

    return {
        createLibrary,
        createItem,
    };
};
