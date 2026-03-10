import { createRoot } from "solid-js";
import { describe, expect, it } from "vitest";
import { createTestTabSession, createTestWorkspace } from "../../__tests__/factories";
import { createWorkspaceQueryApi } from "./createWorkspaceQueryService";
import { createWorkspaceStateService } from "../state";

describe("createWorkspaceQueryService", () => {
    it("builds ordered tabs from root workspaces", () => {
        createRoot((dispose) => {
            const state = createWorkspaceStateService();
            const query = createWorkspaceQueryApi(state);

            state.upsertTabSession(
                createTestTabSession({
                    rootWorkspaceId: "tab-1",
                }),
                createTestWorkspace({
                    id: "tab-1",
                    title: "Main",
                }),
            );
            state.upsertTabSession(
                createTestTabSession({
                    rootWorkspaceId: "tab-2",
                }),
                createTestWorkspace({
                    id: "tab-2",
                    title: "Main",
                }),
            );

            expect(query.orderedTabs()).toEqual([
                { id: "tab-1", title: "Main" },
                { id: "tab-2", title: "Main" },
            ]);

            dispose();
        });
    });

    it("returns workspace children and navigation workspaces", () => {
        createRoot((dispose) => {
            const state = createWorkspaceStateService();
            const query = createWorkspaceQueryApi(state);

            state.upsertTabSession(
                createTestTabSession({
                    rootWorkspaceId: "tab-1",
                }),
                createTestWorkspace({
                    id: "tab-1",
                    title: "Main",
                }),
            );
            state.upsertWorkspace(
                createTestWorkspace({
                    id: "circuit-1",
                    kind: "circuit",
                    title: "Circuit 1",
                    path: ["tab-1"],
                }),
            );
            state.setNavigationPath("tab-1", ["tab-1", "circuit-1"]);

            expect(query.getWorkspaceChildren("tab-1").map((workspace) => workspace.id)).toEqual([
                "circuit-1",
            ]);
            expect(query.getWorkspaceRootId("circuit-1")).toBe("tab-1");
            expect(query.getWorkspaceOpenPath("circuit-1")).toEqual(["tab-1", "circuit-1"]);
            expect(query.getNavigationPath("tab-1")).toEqual(["tab-1", "circuit-1"]);
            expect(query.getNavigationWorkspaces("tab-1").map((workspace) => workspace.id)).toEqual(
                ["tab-1", "circuit-1"],
            );

            dispose();
        });
    });

    it("returns active workspace and active tab session", () => {
        createRoot((dispose) => {
            const state = createWorkspaceStateService();
            const query = createWorkspaceQueryApi(state);

            state.upsertTabSession(
                createTestTabSession({
                    rootWorkspaceId: "tab-1",
                    activeWorkspaceId: "circuit-1",
                    navigationPath: ["tab-1", "circuit-1"],
                }),
                createTestWorkspace({
                    id: "tab-1",
                    title: "Main",
                }),
            );
            state.upsertWorkspace(
                createTestWorkspace({
                    id: "circuit-1",
                    kind: "circuit",
                    title: "Circuit 1",
                    path: ["tab-1"],
                }),
            );
            state.setActiveTab("tab-1");
            state.setActiveWorkspace("circuit-1");

            expect(query.activeTabId()).toBe("tab-1");
            expect(query.activeWorkspaceId()).toBe("circuit-1");
            expect(query.getActiveWorkspace()?.id).toBe("circuit-1");
            expect(query.getActiveTabSession()?.rootWorkspaceId).toBe("tab-1");

            dispose();
        });
    });

    it("finds a workspace in an arbitrary list and calculates the next active tab after close", () => {
        createRoot((dispose) => {
            const state = createWorkspaceStateService();
            const query = createWorkspaceQueryApi(state);

            const firstTab = createTestWorkspace({
                id: "tab-1",
                title: "Main",
            });
            const secondTab = createTestWorkspace({
                id: "tab-2",
                title: "Secondary",
            });

            state.upsertTabSession(
                createTestTabSession({
                    rootWorkspaceId: "tab-1",
                }),
                firstTab,
            );
            state.upsertTabSession(
                createTestTabSession({
                    rootWorkspaceId: "tab-2",
                }),
                secondTab,
            );
            state.setActiveTab("tab-1");

            expect(query.findWorkspace([firstTab, secondTab], "tab-2")?.id).toBe("tab-2");
            expect(query.canCloseTab("tab-1")).toBe(true);
            expect(query.canCloseTab("tab-1", { isEditing: true })).toBe(false);
            expect(query.getNextActiveTabIdAfterClose("tab-1")).toBe("tab-2");

            state.setActiveTab("tab-2");

            expect(query.getNextActiveTabIdAfterClose("tab-1")).toBe("tab-2");
            expect(query.canCloseTab("missing-tab")).toBe(false);

            dispose();
        });
    });
});

