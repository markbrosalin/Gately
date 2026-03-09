import { describe, expect, it } from "vitest";
import { CATALOG_FORMAT_VERSION } from "engine-model/catalog";
import { createCatalogValidationService } from "./createCatalogValidationService";
import { catalogValidationIssueDefs } from "./issues";

describe("createCatalogValidationService", () => {
    it("accepts a valid catalog document", () => {
        const validation = createCatalogValidationService();

        const result = validation.validateDocument({
            formatVersion: CATALOG_FORMAT_VERSION,
            libraries: [
                {
                    formatVersion: CATALOG_FORMAT_VERSION,
                    manifest: {
                        id: "std",
                        name: "Standard",
                        version: "1.0.0",
                        createdAt: 1,
                    },
                    items: [
                        {
                            ref: {
                                libraryId: "std",
                                path: ["gates"],
                                itemName: "AND",
                            },
                            kind: "logic",
                            meta: {
                                name: "AND",
                                createdAt: 1,
                            },
                            layout: {
                                width: 120,
                                height: 80,
                            },
                            modules: [
                                {
                                    type: "logic",
                                    config: {
                                        executor: "std.and",
                                    },
                                },
                                {
                                    type: "ports",
                                    config: {
                                        items: [
                                            {
                                                id: "in-1",
                                                direction: "input",
                                            },
                                            {
                                                id: "out-1",
                                                direction: "output",
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        expect(result).toEqual({
            ok: true,
            subject: "document",
            issues: [],
        });
    });

    it("returns structured document-level result for invalid payloads", () => {
        const validation = createCatalogValidationService();

        const result = validation.validateDocument({
            formatVersion: 999 as typeof CATALOG_FORMAT_VERSION,
            libraries: [
                {
                    formatVersion: 999 as typeof CATALOG_FORMAT_VERSION,
                    manifest: {
                        id: "std",
                        name: "",
                        version: "",
                        createdAt: 0,
                    },
                    items: [
                        {
                            ref: {
                                libraryId: "other",
                                path: [""],
                                itemName: "",
                            },
                            kind: "logic",
                            meta: {
                                name: "",
                                createdAt: 0,
                            },
                            layout: {
                                width: 0,
                                height: -1,
                            },
                            modules: [
                                {
                                    type: "interaction",
                                    config: {
                                        handler: "",
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    formatVersion: CATALOG_FORMAT_VERSION,
                    manifest: {
                        id: "std",
                        name: "Duplicate",
                        version: "1.0.0",
                        createdAt: 1,
                    },
                    items: [],
                },
            ],
        });

        expect(result.ok).toBe(false);
        expect(result.subject).toBe("document");
        expect(result.issues.map((issue) => issue.code)).toEqual(
            expect.arrayContaining([
                catalogValidationIssueDefs.documentFormatVersionInvalid.code,
                catalogValidationIssueDefs.documentLibraryDuplicate.code,
                catalogValidationIssueDefs.libraryManifestNameRequired.code,
            ]),
        );
    });
});
