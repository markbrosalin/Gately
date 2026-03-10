import { Timestamps } from "../core/entity";
import { WORKSPACE_TAB_DOCUMENT_FORMAT_VERSION } from "./constants";

export type WorkspaceKind = "tab" | "circuit";
export type WorkspaceSymbolStandard = "ansi" | "ieee";

export type WorkspaceTabDocument = {
    formatVersion: typeof WORKSPACE_TAB_DOCUMENT_FORMAT_VERSION;
    session: WorkspaceTabSession;
    workspaces: Workspace[];
};

export type Workspace = Timestamps & {
    id: string;
    kind: WorkspaceKind;
    title: string;
    path: string[];
    childrenIds: string[];
};

export type WorkspaceTabCloseConditions = {
    isEditing?: boolean;
};

export type WorkspaceTabSessionSettings = {
    symbolStandard?: WorkspaceSymbolStandard;
};

export type WorkspaceTabSession = Timestamps & {
    rootWorkspaceId: string;
    activeWorkspaceId: string;
    navigationPath: string[];
    settings?: WorkspaceTabSessionSettings;
};

