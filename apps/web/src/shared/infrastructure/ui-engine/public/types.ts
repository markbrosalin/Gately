import type { Graph, Node } from "@antv/x6";
import type { EngineSignalEvent } from "@gately/shared/types";
import type { Accessor } from "solid-js";
import type {
    NodeHashes,
    PinUpdate,
    UIScopeSnapshot,
    UIEngineTabCloseConditions,
    UIEngineTabCreateInput,
    UIEngineTab,
    UIEngineScope,
} from "../model";

export type UIEngineAddNodeCommandInput = {
    hash: NodeHashes;
};

export type UIEngineCommandApi = {
    createTab: (input?: UIEngineTabCreateInput) => Promise<{ tabId: string }>;
    openTab: (tabId?: string) => void;
    openScope: (scopeId: string, tabId?: string) => void;
    canCloseTab: (tabId: string, conditions?: UIEngineTabCloseConditions) => boolean;
    closeTab: (tabId: string, conditions?: UIEngineTabCloseConditions) => Promise<boolean>;
    addNode: (input: UIEngineAddNodeCommandInput) => Promise<Node | undefined>;
    exportScopeSnapshot: () => UIScopeSnapshot;
    importScopeSnapshot: (snapshot?: Partial<UIScopeSnapshot> | null) => void;
    applyPinPatch: (patch: PinUpdate | PinUpdate[]) => void;
    applySignalEvents: (events: EngineSignalEvent | EngineSignalEvent[]) => void;
};

export type UIEngineStateApi = {
    ready: Accessor<boolean>;
    selectionCount: () => number;
    tabs: () => UIEngineTab[];
    activeTabId: Accessor<string | undefined>;
    activeScopeId: Accessor<string | undefined>;
    getScopeById: (id: string) => UIEngineScope | undefined;
    getScopeChildrenById: (id: string) => UIEngineScope[];
    getNavigationPathByTabId: (tabId: string) => string[];
    getNavigationScopesByTabId: (tabId: string) => UIEngineScope[];
    activeNavigationPath: () => string[];
    activeNavigationScopes: () => UIEngineScope[];
};

export type UIEngineMountApi = {
    setContainer: (container?: HTMLDivElement) => void;
};

export type UIEngineDebugApi = {
    graph: () => Graph | undefined;
};

export type UIEnginePublicApi = {
    mount: UIEngineMountApi;
    state: UIEngineStateApi;
    commands: UIEngineCommandApi;
    debug: UIEngineDebugApi;
};

export type UIEngineInstance = UIEnginePublicApi & {
    dispose: () => void;
};

