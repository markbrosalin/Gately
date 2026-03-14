import { Component } from "solid-js";
import { TabClose } from "./TabClose";
import { TabProvider, useTabCtx } from "./TabProvider";
import { TabContextMenu } from "../TabContextMenu/TabContextMenu";
import { UIEngineTab } from "@gately/shared/infrastructure";
import { Tabs } from "@kobalte/core/tabs";
import { tabBarStyles as styles } from "../styles";
import { useOpenNewTab } from "@gately/features/tabs/useOpenTab";
import { isLeftButton } from "@gately/shared/lib/whatButtonClicked";

const InnerTab: Component = () => {
    const ctx = useTabCtx();
    const { openTab } = useOpenNewTab();

    return (
        <TabContextMenu>
            <div
                class={styles.tab.wrap()}
                onPointerEnter={() => ctx.setIsHovered(true)}
                onPointerLeave={() => ctx.setIsHovered(false)}
            >
                <Tabs.Trigger
                    onPointerDown={(e) => {
                        if (!isLeftButton(e)) return;
                        openTab(ctx.tab().id);
                    }}
                    value={ctx.tab().id}
                    class={styles.tab.trigger()}
                >
                    <span class={styles.tab.title()}>{ctx.tab().title}</span>
                </Tabs.Trigger>
                <TabClose />
            </div>
        </TabContextMenu>
    );
};

export const Tab: Component<{ tab: UIEngineTab }> = (props) => (
    <TabProvider tab={props.tab}>
        <InnerTab />
    </TabProvider>
);

