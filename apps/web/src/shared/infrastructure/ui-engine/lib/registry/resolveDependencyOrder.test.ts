import { describe, expect, it } from "vitest";
import { resolveDependencyOrder, type DependencyEntry } from "./resolveDependencyOrder";

describe("resolveDependencyOrder", () => {
    it("orders entries by declared dependencies", () => {
        const entries: Array<DependencyEntry<"a" | "b" | "c", string>> = [
            { name: "c", deps: ["b"], value: "C" },
            { name: "a", value: "A" },
            { name: "b", deps: ["a"], value: "B" },
        ];

        const ordered = resolveDependencyOrder(entries);

        expect(ordered.map((entry) => entry.name)).toEqual(["a", "b", "c"]);
    });

    it("throws on unknown dependency", () => {
        const entries: Array<DependencyEntry<"a" | "b", string>> = [
            { name: "a", deps: ["b"], value: "A" },
        ];

        expect(() => resolveDependencyOrder(entries)).toThrowError('[UIEngine] unknown dependency "b"');
    });

    it("throws on circular dependency", () => {
        const entries: Array<DependencyEntry<"a" | "b", string>> = [
            { name: "a", deps: ["b"], value: "A" },
            { name: "b", deps: ["a"], value: "B" },
        ];

        expect(() => resolveDependencyOrder(entries)).toThrowError(
            '[UIEngine] circular dependency detected for "a"',
        );
    });
});

