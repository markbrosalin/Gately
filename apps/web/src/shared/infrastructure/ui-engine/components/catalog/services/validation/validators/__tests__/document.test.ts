import { describe, expect, it } from "vitest";
import { CATALOG_FORMAT_VERSION } from "engine-model/catalog";
import { catalogValidationIssueDefs } from "../../issues";
import { validateDocumentValue } from "../document";

describe("validateDocumentValue", () => {
    it("prefixes nested library issues into document paths", () => {
        const result = validateDocumentValue({
            formatVersion: CATALOG_FORMAT_VERSION,
            libraries: [
                {
                    formatVersion: CATALOG_FORMAT_VERSION,
                    manifest: {
                        id: "std",
                        name: "",
                        version: "1.0.0",
                        createdAt: 1,
                    },
                    items: [],
                },
            ],
        });

        expect(result.ok).toBe(false);
        expect(result.issues.map((issue) => issue.code)).toContain(
            catalogValidationIssueDefs.libraryManifestNameRequired.code,
        );
        expect(result.issues.find((issue) => issue.code === catalogValidationIssueDefs.libraryManifestNameRequired.code)?.path).toEqual([
            "libraries",
            0,
            "manifest",
            "name",
        ]);
    });
});
