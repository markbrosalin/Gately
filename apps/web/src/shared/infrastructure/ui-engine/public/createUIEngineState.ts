import type { createGraphRuntimeHost } from "../components/graph-runtime";
import type { createWorkspace } from "../components/workspace";
import type { UIEnginePublicApi } from "./types";

type CreateUIEngineStateDeps = {
    workspace: ReturnType<typeof createWorkspace>;
    graphRuntimeHost: ReturnType<typeof createGraphRuntimeHost>;
};

export const createUIEngineState = ({
    workspace,
    graphRuntimeHost,
}: CreateUIEngineStateDeps): UIEnginePublicApi["state"] => {
    return {
        ready: () => Boolean(graphRuntimeHost.runtime()),
        selectionCount: graphRuntimeHost.selectionCount,
        tabs: workspace.query.tabs,
        activeTabId: workspace.query.activeTabId,
        activeScopeId: workspace.query.activeScopeId,
        getScopeById: workspace.query.getScope,
        getScopeChildrenById: workspace.query.getScopeChildren,
        getNavigationPathByTabId: workspace.query.getNavigationPath,
        getNavigationScopesByTabId: workspace.query.getNavigationScopes,
        activeNavigationPath: () => {
            const activeTabId = workspace.query.activeTabId();
            return activeTabId ? workspace.query.getNavigationPath(activeTabId) : [];
        },
        activeNavigationScopes: () => {
            const activeTabId = workspace.query.activeTabId();
            return activeTabId ? workspace.query.getNavigationScopes(activeTabId) : [];
        },
    };
};

