import { describe, expect, it } from "vitest";
import type { CatalogItemRef, CatalogLibraryDocument } from "@engine-model/catalog";
import {
    createTestCompositionItem,
    createTestDocument,
    createTestLibrary,
    createTestLogicItem,
} from "../../../__tests__/factories";
import type { CatalogQueryService } from "../../query";
import { createCatalogExportService } from "./createCatalogExportService";
import { catalogExportIssueDefs } from "./issues";

const createQueryStub = (overrides: Partial<CatalogQueryService> = {}): CatalogQueryService => ({
    document: () => ({ formatVersion: 1, libraries: [] }),
    libraries: () => [],
    librarySummaries: () => [],
    getLibrary: () => undefined,
    hasLibrary: () => false,
    getLibraryItems: () => [],
    getItem: () => undefined,
    hasItem: () => false,
    getItemModules: () => [],
    getItemComposition: () => undefined,
    getItemBoundary: () => undefined,
    getDirectDependencies: () => [],
    getDependentItems: () => [],
    hasDependentItems: () => false,
    collectDependenciesFromRoots: () => ({ items: [], missingRefs: [] }),
    findItemsByKind: () => [],
    findItemsByModuleType: () => [],
    ...overrides,
});

describe("createCatalogExportService", () => {
    it("exports cloned payloads using query service data", () => {
        const andRef: CatalogItemRef = {
            libraryId: "std",
            path: ["gates"],
            itemName: "AND",
        };
        const halfAdderRef: CatalogItemRef = {
            libraryId: "std",
            path: ["arith"],
            itemName: "HALF-ADDER",
        };

        const andItem = createTestLogicItem({
            ref: andRef,
            modules: [
                {
                    type: "logic",
                    config: {
                        executor: "std.logic",
                    },
                },
            ],
        });
        const halfAdder = createTestLogicItem({
            ref: halfAdderRef,
            modules: [
                {
                    type: "logic",
                    config: {
                        executor: "std.logic",
                    },
                },
            ],
        });

        const library: CatalogLibraryDocument = createTestLibrary({
            items: [andItem, halfAdder],
        });
        const document = createTestDocument({
            libraries: [library],
        });

        const query = createQueryStub({
            document: () => document,
            getLibrary: (libraryId) => (libraryId === "std" ? library : undefined),
            getItem: (ref) =>
                ref.itemName === halfAdder.ref.itemName && ref.path[0] === halfAdder.ref.path[0]
                    ? halfAdder
                    : undefined,
            collectDependenciesFromRoots: () => ({
                items: [halfAdder, andItem],
                missingRefs: [],
            }),
        });

        const service = createCatalogExportService({ query });

        const documentResult = service.exportDocument();
        const libraryResult = service.exportLibrary({ libraryId: "std" });
        const bundleResult = service.exportBundle({ rootRefs: [halfAdder.ref] });

        expect(documentResult.ok).toBe(true);
        expect(documentResult.value).toEqual(document);
        expect(documentResult.value).not.toBe(document);

        expect(libraryResult.ok).toBe(true);
        expect(libraryResult.value).toEqual(library);
        expect(libraryResult.value).not.toBe(library);

        expect(bundleResult).toMatchObject({
            ok: true,
            value: {
                formatVersion: 1,
                rootRefs: [halfAdder.ref],
                libraries: [
                    {
                        manifest: library.manifest,
                        items: [halfAdder, andItem],
                    },
                ],
            },
        });
    });

    it("maps invalid export inputs to structured issues", () => {
        const rootRef: CatalogItemRef = {
            libraryId: "std",
            path: ["arith"],
            itemName: "HALF-ADDER",
        };
        const missingRef: CatalogItemRef = {
            libraryId: "std",
            path: ["gates"],
            itemName: "AND",
        };

        const service = createCatalogExportService({
            query: createQueryStub(),
        });

        expect(service.exportLibrary({ libraryId: "" })).toMatchObject({
            ok: false,
            issues: [{ code: catalogExportIssueDefs.libraryIdRequired.code }],
        });
        expect(service.exportLibrary({ libraryId: "missing" })).toMatchObject({
            ok: false,
            issues: [{ code: catalogExportIssueDefs.libraryNotFound.code }],
        });
        expect(service.exportBundle({ rootRefs: [] })).toMatchObject({
            ok: false,
            issues: [{ code: catalogExportIssueDefs.bundleRootRefsRequired.code }],
        });
        expect(service.exportBundle({ rootRefs: [rootRef] })).toMatchObject({
            ok: false,
            issues: [{ code: catalogExportIssueDefs.bundleRootNotFound.code }],
        });

        const rootItem = createTestCompositionItem({
            ref: rootRef,
            dependencyRefs: [missingRef],
            includePortsModule: false,
        });
        const dependencyLibrary: CatalogLibraryDocument = createTestLibrary({
            items: [rootItem],
        });

        const dependencyService = createCatalogExportService({
            query: createQueryStub({
                getLibrary: (libraryId) => (libraryId === "std" ? dependencyLibrary : undefined),
                getItem: () => rootItem,
                collectDependenciesFromRoots: () => ({
                    items: [rootItem],
                    missingRefs: [missingRef],
                }),
            }),
        });

        const dependencyResult = dependencyService.exportBundle({ rootRefs: [rootRef] });
        expect(dependencyResult).toMatchObject({
            ok: false,
            issues: [{ code: catalogExportIssueDefs.bundleDependencyNotFound.code }],
        });
        expect(dependencyResult.issues[0]?.message).toContain("std::gates::AND");
    });
});
