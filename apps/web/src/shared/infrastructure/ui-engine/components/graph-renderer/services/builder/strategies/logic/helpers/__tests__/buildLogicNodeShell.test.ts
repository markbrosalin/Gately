import { describe, expect, it } from "vitest";
import { createBaseNodeMarkup } from "@engine-model/nodes-spec";
import { buildLogicNodeShell } from "../buildLogicNodeShell";

describe("buildLogicNodeShell", () => {
    it("builds the default logic shell markup and attrs", () => {
        const result = buildLogicNodeShell({ minWidth: 64, minHeight: 32 });

        expect(result.markup).toEqual(createBaseNodeMarkup());
        expect(result.attrs?.body?.width).toBe(64);
        expect(result.attrs?.body?.height).toBe(32);
    });
});

