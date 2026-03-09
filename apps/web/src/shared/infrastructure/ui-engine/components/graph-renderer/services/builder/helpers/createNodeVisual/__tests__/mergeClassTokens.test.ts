import { describe, expect, it } from "vitest";
import { mergeClassTokens } from "../mergeClassTokens";

describe("mergeClassTokens", () => {
    it("adds, removes and deduplicates class tokens", () => {
        expect(mergeClassTokens("a b", ["b", "c"], ["a"])).toBe("b c");
    });

    it("returns undefined when no tokens remain", () => {
        expect(mergeClassTokens("a", undefined, ["a"])).toBeUndefined();
    });
});
