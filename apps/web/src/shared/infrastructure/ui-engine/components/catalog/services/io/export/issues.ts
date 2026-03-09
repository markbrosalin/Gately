import { createIssue as createCatalogIssue } from "engine-model/core/issue";

export const catalogExportIssueDefs = {
    libraryIdRequired: {
        code: "catalog.io.export.library-id.required",
        message: "libraryId is required to export a library.",
    },
    libraryNotFound: {
        code: "catalog.io.export.library.not-found",
        message: ({ libraryId }: { libraryId: string }) => `Library "${libraryId}" was not found.`,
    },
    bundleRootRefsRequired: {
        code: "catalog.io.export.bundle.root-refs.required",
        message: "At least one rootRef is required to export a bundle.",
    },
    bundleRootNotFound: {
        code: "catalog.io.export.bundle.root.not-found",
        message: ({ index, refKey }: { index: number; refKey: string }) =>
            `Root ref at index ${index} ("${refKey}") could not be resolved in the catalog.`,
    },
    bundleDependencyNotFound: {
        code: "catalog.io.export.bundle.dependency.not-found",
        message: ({ refKey }: { refKey: string }) =>
            `Dependency ref "${refKey}" could not be resolved in the catalog.`,
    },
} as const;

export const catalogExportIssues = {
    libraryIdRequired: () =>
        createCatalogIssue(catalogExportIssueDefs.libraryIdRequired, ["libraryId"]),
    libraryNotFound: (libraryId: string) =>
        createCatalogIssue(catalogExportIssueDefs.libraryNotFound, ["libraryId"], {
            libraryId,
        }),
    bundleRootRefsRequired: () =>
        createCatalogIssue(catalogExportIssueDefs.bundleRootRefsRequired, ["rootRefs"]),
    bundleRootNotFound: (index: number, refKey: string) =>
        createCatalogIssue(catalogExportIssueDefs.bundleRootNotFound, ["rootRefs", index], {
            index,
            refKey,
        }),
    bundleDependencyNotFound: (refPath: Array<string | number>, refKey: string) =>
        createCatalogIssue(catalogExportIssueDefs.bundleDependencyNotFound, refPath, { refKey }),
} as const;
