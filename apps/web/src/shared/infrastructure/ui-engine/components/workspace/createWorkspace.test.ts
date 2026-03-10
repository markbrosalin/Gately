import { createRoot } from "solid-js";
import { describe, expect, it, vi } from "vitest";
import { createWorkspace } from "./createWorkspace";
import { buildSharedServices } from "../../shared-services";
import type { Workspace, WorkspaceTabDocument } from "@engine-model";
import type { WorkspaceDeps } from "./types";

const createWorkspaceDeps = (): WorkspaceDeps => {
    const shared = buildSharedServices();
    const call = vi.fn().mockResolvedValue({ tabId: "tab-1" });

    return {
        getSharedService: shared.getService,
        external: {
            logicEngine: {
                call,
            } as unknown as NonNullable<WorkspaceDeps["external"]["logicEngine"]>,
        },
    };
};

describe("createWorkspace", () => {
    it("builds workspace use cases on top of the service graph", async () => {
        await createRoot(async (dispose) => {
            const workspace = createWorkspace(createWorkspaceDeps());

            const createResult = await workspace.createTab({
                title: "Main",
            });

            expect(createResult).toEqual({
                ok: true,
                value: { tabId: "tab-1" },
                issues: [],
            });

            const openResult = workspace.open({ workspaceId: "tab-1" });

            expect(openResult.ok).toBe(true);
            expect(workspace.query.activeTabId()).toBe("tab-1");
            expect(workspace.query.activeWorkspaceId()).toBe("tab-1");
            expect(workspace.query.getNavigationPath("tab-1")).toEqual(["tab-1"]);
            expect(workspace.query.orderedTabs()).toEqual([{ id: "tab-1", title: "Main" }]);

            dispose();
        });
    });

    it("exports, imports and updates workspace tabs through use cases", () => {
        createRoot((dispose) => {
            const workspace = createWorkspace({
                ...createWorkspaceDeps(),
                external: {},
            });

            const document: WorkspaceTabDocument = {
                formatVersion: 1,
                session: {
                    rootWorkspaceId: "tab-2",
                    activeWorkspaceId: "circuit-1",
                    navigationPath: ["tab-2", "circuit-1"],
                    createdAt: 1,
                },
                workspaces: [
                    {
                        id: "tab-2",
                        kind: "tab",
                        title: "Imported",
                        path: [],
                        childrenIds: ["circuit-1"],
                        createdAt: 1,
                    },
                    {
                        id: "circuit-1",
                        kind: "circuit",
                        title: "Nested",
                        path: ["tab-2"],
                        childrenIds: [],
                        createdAt: 1,
                    },
                ],
            };

            const importResult = workspace.importTab({ document });
            expect(importResult.ok).toBe(true);

            const updateResult = workspace.updateTitle({
                workspaceId: "circuit-1",
                title: "Nested v2",
            });
            expect(updateResult.ok).toBe(true);
            expect(workspace.query.getWorkspace("circuit-1")?.title).toBe("Nested v2");

            const exportResult = workspace.exportTab({ tabId: "tab-2" });
            expect(exportResult.ok).toBe(true);
            if (!exportResult.ok) {
                throw new Error("Expected exportTab to succeed");
            }
            const exportedWorkspaces: Workspace[] = exportResult.value.workspaces;
            expect(exportedWorkspaces.map((entry) => entry.id)).toEqual(["tab-2", "circuit-1"]);

            const closeResult = workspace.closeTab({ tabId: "tab-2" });
            expect(closeResult.ok).toBe(false);
            expect(workspace.query.canCloseTab("tab-2")).toBe(false);

            dispose();
        });
    });
});


