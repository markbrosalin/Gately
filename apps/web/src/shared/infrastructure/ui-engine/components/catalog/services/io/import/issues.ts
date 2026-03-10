import { createIssue as createCatalogIssue } from "@engine-model/core/issue";

export const catalogImportIssueDefs = {
    bundleFormatVersionInvalid: {
        code: "catalog.io.import.bundle.format-version.invalid",
        message: ({ value }: { value: unknown }) =>
            `Unsupported bundle format version "${String(value)}".`,
    },
    bundleRootRefsRequired: {
        code: "catalog.io.import.bundle.root-refs.required",
        message: "At least one rootRef is required to import a bundle.",
    },
    bundleRootMissing: {
        code: "catalog.io.import.bundle.root.missing",
        message: ({ index, refKey }: { index: number; refKey: string }) =>
            `Root ref at index ${index} ("${refKey}") could not be resolved inside the bundle.`,
    },
    bundleLibraryDuplicate: {
        code: "catalog.io.import.bundle.library.duplicate",
        message: ({ libraryId }: { libraryId: string }) =>
            `Bundle contains duplicate library id "${libraryId}".`,
    },
    bundleItemDuplicateRef: {
        code: "catalog.io.import.bundle.item.duplicate-ref",
        message: ({ refKey }: { refKey: string }) =>
            `Bundle contains duplicate item ref "${refKey}".`,
    },
    bundleDependencyMissing: {
        code: "catalog.io.import.bundle.dependency.missing",
        message: ({ refKey }: { refKey: string }) =>
            `Dependency ref "${refKey}" required by bundle roots is missing in the bundle payload.`,
    },
} as const;

export const catalogImportIssues = {
    bundleFormatVersionInvalid: (value: unknown) =>
        createCatalogIssue(catalogImportIssueDefs.bundleFormatVersionInvalid, ["formatVersion"], {
            value,
        }),
    bundleRootRefsRequired: () =>
        createCatalogIssue(catalogImportIssueDefs.bundleRootRefsRequired, ["rootRefs"]),
    bundleRootMissing: (index: number, refKey: string) =>
        createCatalogIssue(catalogImportIssueDefs.bundleRootMissing, ["rootRefs", index], {
            index,
            refKey,
        }),
    bundleLibraryDuplicate: (index: number, libraryId: string) =>
        createCatalogIssue(
            catalogImportIssueDefs.bundleLibraryDuplicate,
            ["libraries", index, "manifest", "id"],
            { libraryId },
        ),
    bundleItemDuplicateRef: (path: Array<string | number>, refKey: string) =>
        createCatalogIssue(catalogImportIssueDefs.bundleItemDuplicateRef, path, {
            refKey,
        }),
    bundleDependencyMissing: (path: Array<string | number>, refKey: string) =>
        createCatalogIssue(catalogImportIssueDefs.bundleDependencyMissing, path, { refKey }),
} as const;
