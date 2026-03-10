import { describe, expect, it } from "vitest";
import { catalogValidationIssueDefs } from "../../issues";
import { validateRefValue } from "../ref";

describe("validateRefValue", () => {
    it("accepts a valid item ref", () => {
        const result = validateRefValue({
            libraryId: "std",
            path: ["gates"],
            itemName: "AND",
        });

        expect(result).toEqual({
            ok: true,
            subject: "ref",
            issues: [],
        });
    });

    it("returns detailed issues for an invalid item ref", () => {
        const result = validateRefValue(
            {
                libraryId: "",
                path: [""],
                itemName: "",
            },
            ["items", 0, "ref"],
        );

        expect(result.ok).toBe(false);
        expect(result.issues.map((issue) => issue.code)).toEqual([
            catalogValidationIssueDefs.refLibraryIdRequired.code,
            catalogValidationIssueDefs.refPathSegmentInvalid.code,
            catalogValidationIssueDefs.refItemNameRequired.code,
        ]);
        expect(result.issues[0]?.path).toEqual(["items", 0, "ref", "libraryId"]);
    });
});

