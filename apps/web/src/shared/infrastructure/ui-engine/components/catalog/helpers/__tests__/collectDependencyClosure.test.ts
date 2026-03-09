import { describe, expect, it } from "vitest";
import type { CatalogItem } from "engine-model/catalog";
import { createTestCompositionItem, createTestRef } from "../../__tests__/factories";
import { collectDependenciesFromRoots } from "../collectDependenciesFromRoots";
import { getCompositionDependencies } from "../getCompositionDependencies";

describe("collectDependencyClosure helper", () => {
    it("returns items and missing refs with deduplication", () => {
        const aRef = createTestRef({ path: ["a"], itemName: "A" });
        const bRef = createTestRef({ path: ["b"], itemName: "B" });
        const cRef = createTestRef({ path: ["c"], itemName: "C" }); // missing

        const items = new Map<string, CatalogItem>([
            ["std::a::A", createTestCompositionItem({ ref: aRef, dependencyRefs: [bRef, cRef] })],
            ["std::b::B", createTestCompositionItem({ ref: bRef })],
        ]);

        const closure = collectDependenciesFromRoots({
            rootRefs: [aRef],
            resolveItem: (ref) => items.get([ref.libraryId, ...ref.path, ref.itemName].join("::")),
            getDependencies: getCompositionDependencies,
        });

        expect(closure.items.map((i) => i.ref.itemName)).toEqual(["A", "B"]);
        expect(closure.missingRefs.map((r) => r.itemName)).toEqual(["C"]);
    });

    it("skips invalid refs when validateRef is provided", () => {
        const aRef = createTestRef({ path: ["a"], itemName: "A" });
        const badRef = createTestRef({ libraryId: "", path: ["x"], itemName: "BAD" });

        const items = new Map<string, CatalogItem>([
            ["std::a::A", createTestCompositionItem({ ref: aRef, dependencyRefs: [badRef] })],
        ]);

        const closure = collectDependenciesFromRoots({
            rootRefs: [aRef],
            resolveItem: (ref) => items.get([ref.libraryId, ...ref.path, ref.itemName].join("::")),
            getDependencies: getCompositionDependencies,
            validateRef: (ref) => ref.libraryId.length > 0 && ref.itemName.length > 0,
        });

        expect(closure.items.map((i) => i.ref.itemName)).toEqual(["A"]);
        expect(closure.missingRefs).toHaveLength(0);
    });
});
