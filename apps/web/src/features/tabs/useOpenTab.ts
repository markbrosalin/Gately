import { UIEngineTabCreateInput, useUIEngine } from "@gately/shared/infrastructure";

export const useOpenNewTab = () => {
    const uiEngine = useUIEngine();

    const openNewTab = (data: UIEngineTabCreateInput = {}) => uiEngine.commands.createTab(data);
    const openTab = (tabId?: string) => uiEngine.commands.openTab(tabId);

    return { openNewTab, openTab };
};

