import { useUIEngine } from "@gately/shared/infrastructure";

export const useCloseTab = () => {
    const uiEngine = useUIEngine();
    const closeTab = (tabId: string, conditions?: { isEditing?: boolean }) =>
        uiEngine.commands.closeTab(tabId, conditions);
    const canCloseTab = (tabId: string, conditions?: { isEditing?: boolean }) =>
        uiEngine.commands.canCloseTab(tabId, conditions);

    return { closeTab, canCloseTab };
};

