import { describe, expect, it } from "vitest";
import { applyStaticClassPatch } from "../applyStaticClassPatch";

describe("applyStaticClassPatch", () => {
    it("patches selector classes without mutating other attrs", () => {
        const result = applyStaticClassPatch(
            {
                body: { class: "base old", fill: "red" },
                icon: { class: "icon" },
            },
            {
                body: {
                    add: ["next"],
                    remove: ["old"],
                },
            },
        );

        expect(result).toEqual({
            body: { class: "base next", fill: "red" },
            icon: { class: "icon" },
        });
    });

    it("removes selector class when patch clears all tokens", () => {
        const result = applyStaticClassPatch(
            {
                body: { class: "base" },
            },
            {
                body: {
                    remove: ["base"],
                },
            },
        );

        expect(result).toEqual({
            body: {},
        });
    });
});
