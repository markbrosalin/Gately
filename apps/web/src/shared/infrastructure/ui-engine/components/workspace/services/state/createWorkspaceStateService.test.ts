import { createRoot } from "solid-js";
import { describe, expect, it } from "vitest";
import {
    createTestTabSession,
    createTestWorkspace,
} from "../../__tests__/factories";
import { createWorkspaceStateService } from "./createWorkspaceStateService";

describe("createWorkspaceStateService", () => {
    it("stores workspace and tab session and keeps active ids in sync", () => {
        createRoot((dispose) => {
            const state = createWorkspaceStateService();

            state.upsertWorkspace(
                createTestWorkspace({
                    id: "tab-1",
                    title: "Main",
                }),
            );
            state.upsertTabSession(
                createTestTabSession({
                    rootWorkspaceId: "tab-1",
                }),
                createTestWorkspace({
                    id: "tab-1",
                    title: "Main",
                }),
            );

            expect(state.orderedTabIds()).toEqual(["tab-1"]);
            state.setActiveTab("tab-1");
            state.setActiveWorkspace("tab-1");
            expect(state.activeTabId()).toBe("tab-1");
            expect(state.activeWorkspaceId()).toBe("tab-1");
            expect(state.getWorkspace("tab-1")?.title).toBe("Main");
            expect(state.getWorkspace("tab-1")?.childrenIds).toEqual([]);
            expect(state.getTabSession("tab-1")?.navigationPath).toEqual(["tab-1"]);

            dispose();
        });
    });

    it("attaches child workspaces and clears active ids when a tab session is removed", () => {
        createRoot((dispose) => {
            const state = createWorkspaceStateService();

            state.upsertTabSession(
                createTestTabSession({
                    rootWorkspaceId: "tab-1",
                }),
                createTestWorkspace({
                    id: "tab-1",
                    title: "Main",
                }),
            );
            state.setActiveTab("tab-1");
            state.setActiveWorkspace("tab-1");

            state.upsertWorkspace(
                createTestWorkspace({
                    id: "circuit-1",
                    kind: "circuit",
                    title: "Circuit 1",
                    path: ["tab-1"],
                }),
            );
            expect(state.getWorkspace("tab-1")?.childrenIds).toEqual(["circuit-1"]);

            state.removeTabSession("tab-1");

            expect(state.activeTabId()).toBeUndefined();
            expect(state.activeWorkspaceId()).toBeUndefined();
            expect(state.orderedTabIds()).toEqual([]);
            expect(state.getWorkspace("tab-1")).toBeUndefined();
            expect(state.getWorkspace("circuit-1")).toBeUndefined();
            expect(state.getTabSession("tab-1")).toBeUndefined();

            dispose();
        });
    });

    it("does not choose the next active tab when the current tab session is removed", () => {
        createRoot((dispose) => {
            const state = createWorkspaceStateService();

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
                    title: "Aux",
                }),
            );

            state.setActiveTab("tab-2");
            state.setActiveWorkspace("tab-2");

            state.removeTabSession("tab-2");

            expect(state.orderedTabIds()).toEqual(["tab-1"]);
            expect(state.activeTabId()).toBeUndefined();
            expect(state.activeWorkspaceId()).toBeUndefined();

            dispose();
        });
    });

    it("removes a workspace subtree and detaches it from the parent", () => {
        createRoot((dispose) => {
            const state = createWorkspaceStateService();

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
            state.upsertWorkspace(
                createTestWorkspace({
                    id: "circuit-2",
                    kind: "circuit",
                    title: "Circuit 2",
                    path: ["tab-1", "circuit-1"],
                }),
            );

            state.removeWorkspace("circuit-1");

            expect(state.getWorkspace("tab-1")?.childrenIds).toEqual([]);
            expect(state.getWorkspace("circuit-1")).toBeUndefined();
            expect(state.getWorkspace("circuit-2")).toBeUndefined();

            dispose();
        });
    });
});

