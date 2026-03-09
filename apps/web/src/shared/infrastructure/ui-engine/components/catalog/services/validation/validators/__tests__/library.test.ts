import { describe, expect, it } from "vitest";
import { CATALOG_FORMAT_VERSION } from "engine-model/catalog";
import { catalogValidationIssueDefs } from "../../issues";
import { validateLibraryValue } from "../library";

describe("validateLibraryValue", () => {
    it("reports duplicate refs inside a library", () => {
        const sharedRef = {
            libraryId: "std",
            path: ["gates"],
            itemName: "AND",
        };

        const result = validateLibraryValue({
            formatVersion: CATALOG_FORMAT_VERSION,
            manifest: {
                id: "std",
                name: "Standard",
                version: "1.0.0",
                createdAt: 1,
            },
            items: [
                {
                    ref: sharedRef,
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
                    ],
                },
                {
                    ref: sharedRef,
                    kind: "logic",
                    meta: {
                        name: "AND Copy",
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
                    ],
                },
            ],
        });

        expect(result.ok).toBe(false);
        expect(result.issues.map((issue) => issue.code)).toContain(
            catalogValidationIssueDefs.libraryItemDuplicateRef.code,
        );
    });
});
