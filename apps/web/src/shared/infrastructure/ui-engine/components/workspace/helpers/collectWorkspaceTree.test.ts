import { describe, expect, it } from "vitest";
import type { Workspace } from "@engine-model";
import {
    collectWorkspaceTree,
    collectWorkspaceTreeByQuery,
    collectWorkspaceTreeIds,
} from "./collectWorkspaceTree";

const createWorkspace = (overrides: Partial<Workspace> & Pick<Workspace, "id">): Workspace => ({
    id: overrides.id,
    kind: overrides.kind ?? "tab",
    title: overrides.title ?? overrides.id,
    path: overrides.path ?? [],
    childrenIds: overrides.childrenIds ?? [],
    createdAt: overrides.createdAt ?? 1,
    updatedAt: overrides.updatedAt,
});

describe("collectWorkspaceTree", () => {
    it("collects the root workspace and all nested children ids", () => {
        const workspaces: Record<string, Workspace> = {
            "tab-1": createWorkspace({
                id: "tab-1",
                childrenIds: ["circuit-1"],
            }),
            "circuit-1": createWorkspace({
                id: "circuit-1",
                kind: "circuit",
                path: ["tab-1"],
                childrenIds: ["circuit-2"],
            }),
            "circuit-2": createWorkspace({
                id: "circuit-2",
                kind: "circuit",
                path: ["tab-1", "circuit-1"],
            }),
        };

        expect(collectWorkspaceTreeIds(workspaces, "tab-1")).toEqual([
            "tab-1",
            "circuit-1",
            "circuit-2",
        ]);
    });

    it("collects the root workspace and all nested children entities", () => {
        const workspaces: Record<string, Workspace> = {
            "tab-1": createWorkspace({
                id: "tab-1",
                childrenIds: ["circuit-1"],
            }),
            "circuit-1": createWorkspace({
                id: "circuit-1",
                kind: "circuit",
                path: ["tab-1"],
            }),
        };

        expect(collectWorkspaceTree(workspaces, "tab-1").map((workspace) => workspace.id)).toEqual([
            "tab-1",
            "circuit-1",
        ]);
    });

    it("collects the tree through query-style getters", () => {
        const workspaces: Record<string, Workspace> = {
            "tab-1": createWorkspace({
                id: "tab-1",
                childrenIds: ["circuit-1"],
            }),
            "circuit-1": createWorkspace({
                id: "circuit-1",
                kind: "circuit",
                path: ["tab-1"],
                childrenIds: ["circuit-2"],
            }),
            "circuit-2": createWorkspace({
                id: "circuit-2",
                kind: "circuit",
                path: ["tab-1", "circuit-1"],
            }),
        };

        expect(
            collectWorkspaceTreeByQuery(
                "tab-1",
                (workspaceId) => workspaces[workspaceId],
                (workspaceId) =>
                    workspaces[workspaceId]?.childrenIds
                        .map((childId) => workspaces[childId])
                        .filter((workspace): workspace is Workspace => Boolean(workspace)) ?? [],
            ).map((workspace) => workspace.id),
        ).toEqual(["tab-1", "circuit-1", "circuit-2"]);
    });
});
