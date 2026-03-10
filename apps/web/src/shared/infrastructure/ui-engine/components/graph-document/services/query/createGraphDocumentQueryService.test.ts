import { describe, expect, it } from "vitest";
import { createGraphDocumentFactoryService } from "../factory";
import { createGraphDocumentQueryApi } from "./createGraphDocumentQueryService";
import { createGraphDocumentStateService } from "../state";

describe("createGraphDocumentQueryService", () => {
    it("reads graph documents from state", () => {
        const state = createGraphDocumentStateService();
        const factory = createGraphDocumentFactoryService();
        const query = createGraphDocumentQueryApi(state);

        const document = factory.createDocument({
            workspaceId: "workspace-1",
            contentJson: '{"cells":[{"id":"n-1"}]}',
        });

        state.upsertDocument(document);

        expect(query.documents()).toEqual([document]);
        expect(query.documentsByWorkspaceId()).toEqual({
            "workspace-1": document,
        });
        expect(query.getDocument("workspace-1")).toEqual(document);
        expect(query.hasDocument("workspace-1")).toBe(true);
        expect(query.hasDocument("workspace-2")).toBe(false);
    });
});

