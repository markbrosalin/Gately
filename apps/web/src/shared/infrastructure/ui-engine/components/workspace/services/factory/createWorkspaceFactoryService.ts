import { type Workspace, type WorkspaceTabSession } from "@engine-model";
import {
    WorkspaceCircuitFactoryInput,
    WorkspaceFactoryService,
    WorkspaceTabFactoryInput,
    WorkspaceTabSessionCreateInput,
} from "./types";

export const createWorkspaceFactoryService = (): WorkspaceFactoryService => {
    const createTabWorkspace = (data: WorkspaceTabFactoryInput): Workspace => ({
        id: data.id,
        kind: "tab",
        title: data.title ?? "New Tab",
        path: [],
        childrenIds: data.childrenIds ?? [],
        createdAt: Date.now(),
    });

    const createCircuitWorkspace = (data: WorkspaceCircuitFactoryInput): Workspace => ({
        id: data.id,
        kind: "circuit",
        title: data.title,
        path: data.path,
        childrenIds: data.childrenIds ?? [],
        createdAt: Date.now(),
    });

    const createTabSession = (data: WorkspaceTabSessionCreateInput): WorkspaceTabSession => {
        return {
            rootWorkspaceId: data.rootWorkspaceId,
            activeWorkspaceId: data.rootWorkspaceId,
            navigationPath: [],
            settings: data.settings,
            createdAt: Date.now(),
        };
    };

    return {
        createCircuitWorkspace,
        createTabWorkspace,
        createTabSession,
    };
};


