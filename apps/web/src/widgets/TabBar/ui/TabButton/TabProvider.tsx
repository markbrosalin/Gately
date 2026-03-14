import { UIEngineTab, useUIEngine } from "@gately/shared/infrastructure";
import {
    Accessor,
    Component,
    createContext,
    createSignal,
    JSX,
    Setter,
    useContext,
} from "solid-js";

interface TabContext {
    tab: Accessor<UIEngineTab>;
    isActive: Accessor<boolean>;

    isTitleEditing: Accessor<boolean>;
    setIsTitleEditing: Setter<boolean>;

    isHovered: Accessor<boolean>;
    setIsHovered: Setter<boolean>;
}

const TabContext = createContext<TabContext>();

export const TabProvider: Component<{ tab: UIEngineTab; children: JSX.Element }> = (props) => {
    const uiEngine = useUIEngine();
    const tab = () => props.tab;

    const [isTitleEditing, setIsTitleEditing] = createSignal(false);
    const [isHovered, setIsHovered] = createSignal(false);
    const isActive = () => props.tab.id === uiEngine.query.workspace.activeTabId();

    const context: TabContext = {
        tab,
        isActive,
        isTitleEditing,
        setIsTitleEditing,
        isHovered,
        setIsHovered,
    };

    return <TabContext.Provider value={context}>{props.children}</TabContext.Provider>;
};

export const useTabCtx = () => {
    const ctx = useContext(TabContext);
    if (!ctx) throw new Error("useTabCtx must be used within a TabProvider");
    return ctx;
};

