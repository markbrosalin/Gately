import { useUIEngine } from "@gately/shared/infrastructure";

export const useCloseTab = () => {
    const uiEngine = useUIEngine();
    const closeTab = (tabId: string, conditions?: { isEditing?: boolean }) =>
        uiEngine.api.closeTab({ tabId, conditions });
    const canCloseTab = (tabId: string, conditions?: { isEditing?: boolean }) =>
        uiEngine.query.workspace.canCloseTab(tabId, conditions);

    return { closeTab, canCloseTab };
};
