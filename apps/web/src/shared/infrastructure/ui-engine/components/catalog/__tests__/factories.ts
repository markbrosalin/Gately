import { CATALOG_FORMAT_VERSION } from "engine-model/catalog";
import type {
    CatalogBundleDocument,
    CatalogCompositionBoundary,
    CatalogDocument,
    CatalogItem,
    CatalogItemRef,
    CatalogLibraryDocument,
} from "engine-model/catalog";

export const createTestRef = (overrides: Partial<CatalogItemRef> = {}): CatalogItemRef => ({
    libraryId: overrides.libraryId ?? "std",
    path: overrides.path ?? ["gates"],
    itemName: overrides.itemName ?? "AND",
});

export const createTestLogicItem = ({
    ref = createTestRef(),
    name = ref.itemName,
    layout = {
        width: 120,
        height: 80,
    },
    modules = [
        {
            type: "logic",
            config: {
                executor: "std.logic",
            },
        },
    ],
}: {
    ref?: CatalogItemRef;
    name?: string;
    layout?: CatalogItem["layout"];
    modules?: CatalogItem["modules"];
} = {}): CatalogItem => ({
    ref,
    kind: "logic",
    meta: {
        name,
        createdAt: 1,
    },
    layout,
    modules,
});

export const createTestCompositionItem = ({
    ref = createTestRef({
        path: ["circuits"],
        itemName: "HALF-ADDER",
    }),
    dependencyRefs = [],
    name = ref.itemName,
    layout = {
        width: 120,
        height: 80,
    },
    boundary = {
        inputs: [],
        outputs: [],
    },
    includePortsModule = true,
}: {
    ref?: CatalogItemRef;
    dependencyRefs?: CatalogItemRef[];
    name?: string;
    layout?: CatalogItem["layout"];
    boundary?: CatalogCompositionBoundary;
    includePortsModule?: boolean;
} = {}): CatalogItem => {
    const modules: CatalogItem["modules"] = [
        {
            type: "composition",
            config: {
                contentJson: "",
                items: dependencyRefs.map((dependencyRef, index) => ({
                    id: `inner-${index}`,
                    ref: dependencyRef,
                })),
                connections: [],
                boundary,
                inputBindings: [],
                outputBindings: [],
            },
        },
    ];

    if (includePortsModule) {
        modules.push({
            type: "ports",
            config: {
                items: [],
            },
        });
    }

    return createTestLogicItem({
        ref,
        name,
        layout,
        modules,
    });
};

export const createTestLibrary = ({
    id = "std",
    name = "Standard",
    version = "1.0.0",
    items = [],
}: {
    id?: string;
    name?: string;
    version?: string;
    items?: CatalogItem[];
} = {}): CatalogLibraryDocument => ({
    formatVersion: CATALOG_FORMAT_VERSION,
    manifest: {
        id,
        name,
        version,
        createdAt: 1,
    },
    items,
});

export const createTestDocument = ({
    libraries = [createTestLibrary()],
}: {
    libraries?: CatalogLibraryDocument[];
} = {}): CatalogDocument => ({
    formatVersion: CATALOG_FORMAT_VERSION,
    libraries,
});

export const createTestBundle = ({
    rootRefs = [createTestRef()],
    libraries = [createTestLibrary()],
}: {
    rootRefs?: CatalogItemRef[];
    libraries?: CatalogLibraryDocument[];
} = {}): CatalogBundleDocument => ({
    formatVersion: CATALOG_FORMAT_VERSION,
    rootRefs,
    libraries,
});
