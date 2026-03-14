import { UIEngineTabCreateInput, useUIEngine } from "@gately/shared/infrastructure";

export const useOpenNewTab = () => {
    const uiEngine = useUIEngine();

    const openNewTab = (data: UIEngineTabCreateInput = {}) => uiEngine.useCases.createTab(data);
    const openTab = (tabId?: string) =>
        tabId ? uiEngine.useCases.openWorkspace({ workspaceId: tabId }) : undefined;

    return { openNewTab, openTab };
};

