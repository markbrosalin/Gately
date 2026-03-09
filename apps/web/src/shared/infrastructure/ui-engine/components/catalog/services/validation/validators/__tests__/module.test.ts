import { describe, expect, it } from "vitest";
import { catalogValidationIssueDefs } from "../../issues";
import { createValidationResult } from "../../helpers";
import { validateModuleValue } from "../module";

describe("validateModuleValue", () => {
    it("reports unsupported module for item kind", () => {
        const result = createValidationResult("item");

        validateModuleValue(
            {
                type: "logic",
                config: {
                    executor: "std.and",
                },
            },
            "annotation",
            result,
            ["modules", 0],
        );

        expect(result.ok).toBe(false);
        expect(result.issues[0]?.code).toBe(catalogValidationIssueDefs.itemModuleUnsupported.code);
        expect(result.issues[0]?.path).toEqual(["modules", 0, "type"]);
    });

    it("reports duplicate port ids in ports module", () => {
        const result = createValidationResult("item");

        validateModuleValue(
            {
                type: "ports",
                config: {
                    inputs: [{ id: "in-1" }],
                    outputs: [{ id: "in-1" }],
                },
            },
            "logic",
            result,
            ["modules", 1],
        );

        expect(result.ok).toBe(false);
        expect(result.issues.map((issue) => issue.code)).toContain(
            catalogValidationIssueDefs.itemPortIdDuplicate.code,
        );
    });

    it("accepts zero timing delay values", () => {
        const result = createValidationResult("item");

        validateModuleValue(
            {
                type: "timing",
                config: {
                    rise: 0,
                    fall: 0,
                },
            },
            "logic",
            result,
            ["modules", 2],
        );

        expect(result.ok).toBe(true);
    });

    it("reports invalid composition references", () => {
        const result = createValidationResult("item");

        validateModuleValue(
            {
                type: "composition",
                config: {
                    contentJson: "",
                    items: [
                        {
                            id: "inner-0",
                            ref: {
                                libraryId: "std",
                                path: ["gates"],
                                itemName: "NOR",
                            },
                        },
                    ],
                    connections: [
                        {
                            from: { itemId: "missing", portId: "0" },
                            to: { itemId: "inner-0", portId: "" },
                        },
                    ],
                    boundary: {
                        inputs: [
                            {
                                outerPortId: "",
                                position: {
                                    x: Number.NaN,
                                    y: Infinity,
                                },
                            },
                        ],
                        outputs: [],
                    },
                    inputBindings: [
                        {
                            outerPortId: "",
                            targets: [],
                        },
                    ],
                    outputBindings: [
                        {
                            outerPortId: "out",
                            source: { itemId: "missing", portId: "0" },
                        },
                    ],
                },
            },
            "logic",
            result,
            ["modules", 3],
        );

        expect(result.ok).toBe(false);
        expect(result.issues.map((issue) => issue.code)).toEqual(
            expect.arrayContaining([
                catalogValidationIssueDefs.itemCompositionPinItemMissing.code,
                catalogValidationIssueDefs.itemCompositionPinPortIdRequired.code,
                catalogValidationIssueDefs.itemCompositionOuterPortIdRequired.code,
                catalogValidationIssueDefs.itemCompositionTargetsRequired.code,
                catalogValidationIssueDefs.itemCompositionBoundaryPositionXInvalid.code,
                catalogValidationIssueDefs.itemCompositionBoundaryPositionYInvalid.code,
            ]),
        );
    });
});
