import { LogoButton } from "./LogoButton";
import { Component, For, onMount } from "solid-js";
import { TabAdder } from "./TabAdder";
import { useUIEngine } from "@gately/shared/infrastructure";
import { Tabs } from "@kobalte/core/tabs";
import { Tab } from "./TabButton";
import { TabScroller } from "./TabScroller";
import { ListScroller } from "@gately/shared/ui/ListScroller/ListScroller";
import { useOpenNewTab } from "@gately/features/tabs/useOpenTab";

export const TabBar: Component = () => {
    const uiEngine = useUIEngine();
    const firstTab = useOpenNewTab();

    onMount(() => {
        if (uiEngine.query.workspace.orderedTabs().length || uiEngine.query.workspace.activeTabId())
            return;
        void firstTab.openNewTab();
    });

    return (
        <ListScroller
            activeKey={uiEngine.query.workspace.activeTabId}
            step={150}
            wheelMultiplier={0.25}
            behavior="smooth"
            padding={0}
        >
            <Tabs
                class="bg-gray-12 flex flex-row h-10 w-full overflow-hidden"
                value={uiEngine.query.workspace.activeTabId()}
            >
                <LogoButton class="shrink-0" />

                <Tabs.List class="flex-1 flex items-center overflow-x-hidden h-full">
                    <ListScroller.List class="flex items-center h-full overflow-x-auto scrollbar-hide">
                        <For each={uiEngine.query.workspace.orderedTabs()}>
                            {(tab) => <Tab tab={tab} />}
                        </For>
                    </ListScroller.List>
                    <TabAdder class="shrink-0" />
                </Tabs.List>
                <TabScroller class="shrink-0 h-full" />
            </Tabs>
        </ListScroller>
    );
};

