import { describe, expect, it } from "vitest";
import type {
    CatalogBundleDocument,
    CatalogDocument,
    CatalogValidationResult,
} from "engine-model/catalog";
import {
    createTestBundle,
    createTestCompositionItem,
    createTestDocument,
    createTestLibrary,
    createTestLogicItem,
    createTestRef,
} from "../../../__tests__/factories";
import type { CatalogValidationService } from "../../validation";
import { catalogImportIssueDefs } from "./issues";
import { createCatalogImportService } from "./createCatalogImportService";

const okRefResult = (): CatalogValidationResult<"ref"> => ({
    ok: true,
    subject: "ref",
    issues: [],
});

const okItemResult = (): CatalogValidationResult<"item"> => ({
    ok: true,
    subject: "item",
    issues: [],
});

const okLibraryResult = (): CatalogValidationResult<"library"> => ({
    ok: true,
    subject: "library",
    issues: [],
});

const okDocumentResult = (): CatalogValidationResult<"document"> => ({
    ok: true,
    subject: "document",
    issues: [],
});

const createValidationStub = (
    overrides: Partial<CatalogValidationService> = {},
): CatalogValidationService => ({
    validateRef: () => okRefResult(),
    validateItem: () => okItemResult(),
    validateLibrary: () => okLibraryResult(),
    validateDocument: () => okDocumentResult(),
    ...overrides,
});

describe("createCatalogImportService", () => {
    it("returns cloned payloads when validation accepts input", () => {
        const service = createCatalogImportService({
            validation: createValidationStub(),
        });

        const item = createTestLogicItem({
            ref: createTestRef(),
            modules: [
                {
                    type: "logic",
                    config: {
                        executor: "std.and",
                    },
                },
            ],
        });
        const library = createTestLibrary({
            items: [item],
        });
        const document: CatalogDocument = createTestDocument({
            libraries: [library],
        });
        const bundle: CatalogBundleDocument = createTestBundle({
            rootRefs: [item.ref],
            libraries: [library],
        });

        const documentResult = service.importDocument(document);
        const libraryResult = service.importLibrary(library);
        const bundleResult = service.importBundle(bundle);

        expect(documentResult.ok).toBe(true);
        expect(documentResult.value).toEqual(document);
        expect(documentResult.value).not.toBe(document);
        expect(libraryResult.ok).toBe(true);
        expect(libraryResult.value).toEqual(library);
        expect(libraryResult.value).not.toBe(library);
        expect(bundleResult.ok).toBe(true);
        expect(bundleResult.value).toEqual(bundle);
        expect(bundleResult.value).not.toBe(bundle);
    });

    it("returns top-level validation failures and bundle header issue", () => {
        const service = createCatalogImportService({
            validation: createValidationStub({
                validateDocument: () => ({
                    ok: false,
                    subject: "document",
                    issues: [
                        { code: "document.invalid", message: "invalid", path: ["formatVersion"] },
                    ],
                }),
                validateLibrary: () => ({
                    ok: false,
                    subject: "library",
                    issues: [{ code: "library.invalid", message: "invalid", path: ["manifest"] }],
                }),
            }),
        });

        expect(service.importDocument(createTestDocument())).toMatchObject({
            ok: false,
            issues: [{ code: "document.invalid" }],
        });
        expect(service.importLibrary(createTestLibrary())).toMatchObject({
            ok: false,
            issues: [{ code: "library.invalid" }],
        });

        const bundleHeaderService = createCatalogImportService({
            validation: createValidationStub(),
        });
        const bundleHeaderResult = bundleHeaderService.importBundle({
            ...createTestBundle(),
            rootRefs: [],
        });
        expect(bundleHeaderResult.ok).toBe(false);
        expect(bundleHeaderResult.issues.map((issue) => issue.code)).toContain(
            catalogImportIssueDefs.bundleRootRefsRequired.code,
        );
    });

    it("maps dependency and invalid-ref issues without duplicate root-missing noise", () => {
        const service = createCatalogImportService({
            validation: createValidationStub({
                validateRef: (ref) =>
                    ref.libraryId && ref.itemName
                        ? okRefResult()
                        : {
                              ok: false,
                              subject: "ref",
                              issues: [
                                  {
                                      code: "ref.invalid",
                                      message: "invalid",
                                      path: ["libraryId"],
                                  },
                              ],
                          },
            }),
        });

        const missingDependencyRef = createTestRef();
        const rootItem = createTestCompositionItem({
            ref: createTestRef({
                path: ["arith"],
                itemName: "HALF-ADDER",
            }),
            dependencyRefs: [missingDependencyRef],
        });
        const missingDependencyResult = service.importBundle(
            createTestBundle({
                rootRefs: [rootItem.ref],
                libraries: [
                    createTestLibrary({
                        items: [rootItem],
                    }),
                ],
            }),
        );
        expect(missingDependencyResult).toMatchObject({
            ok: false,
            issues: [{ code: catalogImportIssueDefs.bundleDependencyMissing.code }],
        });

        const invalidRootResult = service.importBundle({
            ...createTestBundle(),
            rootRefs: [
                {
                    libraryId: "",
                    path: ["gates"],
                    itemName: "",
                },
            ],
        });

        expect(invalidRootResult.ok).toBe(false);
        expect(invalidRootResult.issues.map((issue) => issue.code)).toContain("ref.invalid");
        expect(invalidRootResult.issues.map((issue) => issue.code)).not.toContain(
            catalogImportIssueDefs.bundleRootMissing.code,
        );
    });
});
