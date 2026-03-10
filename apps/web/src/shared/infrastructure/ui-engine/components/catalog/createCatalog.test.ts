import { createRoot } from "solid-js";
import { describe, expect, it } from "vitest";
import { buildSharedServices } from "../../shared-services";
import { createCatalog } from "./createCatalog";

describe("createCatalog", () => {
    it("wires catalog use cases through public component API", () => {
        createRoot((dispose) => {
            const { getService } = buildSharedServices();
            const catalog = createCatalog({
                external: {},
                getSharedService: getService,
            });

            const result = catalog.createLibrary({
                id: "std",
                name: "Standard",
            });

            expect(result.ok).toBe(true);
            expect(catalog.query.libraries()).toEqual([
                {
                    formatVersion: 1,
                    manifest: {
                        id: "std",
                        name: "Standard",
                        version: "1.0.0",
                        createdAt: expect.any(Number),
                    },
                    items: [],
                },
            ]);
            expect(catalog.query.getLibrary("std")?.manifest.name).toBe("Standard");

            dispose();
        });
    });
});

