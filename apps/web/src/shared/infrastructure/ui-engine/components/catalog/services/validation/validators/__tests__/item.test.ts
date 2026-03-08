import { describe, expect, it } from "vitest";
import { catalogValidationIssueDefs } from "../../issues";
import { validateItemValue } from "../item";

describe("validateItemValue", () => {
    it("requires a logic or composition module for logic items", () => {
        const result = validateItemValue({
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
            modules: [],
        });

        expect(result.ok).toBe(false);
        expect(result.issues.map((issue) => issue.code)).toContain(
            catalogValidationIssueDefs.itemLogicModuleMissing.code,
        );
    });

    it("accepts a composition-only logic item", () => {
        const result = validateItemValue({
            ref: {
                libraryId: "std",
                path: ["circuits"],
                itemName: "RS-TRIGGER",
            },
            kind: "logic",
            meta: {
                name: "RS-TRIGGER",
                createdAt: 1,
            },
            layout: {
                width: 120,
                height: 80,
            },
            modules: [
                {
                    type: "composition",
                    config: {
                        contentJson: "",
                        items: [],
                        connections: [],
                        boundary: {
                            inputs: [],
                            outputs: [],
                        },
                        inputBindings: [],
                        outputBindings: [],
                    },
                },
                {
                    type: "ports",
                    config: {
                        items: [],
                    },
                },
            ],
        });

        expect(result.ok).toBe(true);
    });

    it("reports invalid geometry", () => {
        const result = validateItemValue({
            ref: {
                libraryId: "std",
                path: ["debug"],
                itemName: "Probe",
            },
            kind: "debug",
            meta: {
                name: "Probe",
                createdAt: 1,
            },
            layout: {
                width: 0,
                height: -1,
            },
            modules: [
                {
                    type: "interaction",
                    config: {
                        handler: "noop",
                    },
                },
            ],
        });

        expect(result.ok).toBe(false);
        expect(result.issues.map((issue) => issue.code)).toEqual(
            expect.arrayContaining([
                catalogValidationIssueDefs.itemLayoutWidthInvalid.code,
                catalogValidationIssueDefs.itemLayoutHeightInvalid.code,
            ]),
        );
    });
});
