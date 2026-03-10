import { Pusher } from "@gately/shared/ui";
import { tabBarStyles as styles } from "../styles";
import { Component, createMemo } from "solid-js";
import { useCloseTab } from "@gately/features/tabs/useCloseTab";
import { useTabCtx } from "./TabProvider";
import { CrossIcon } from "@gately/shared/assets/IconComponents";

export const TabClose: Component = () => {
    const { closeTab, canCloseTab } = useCloseTab();

    const currTabCtx = useTabCtx();

    const shouldShow = createMemo(
        () =>
            currTabCtx.isHovered() &&
            canCloseTab(currTabCtx.tab().id, { isEditing: currTabCtx.isTitleEditing() }),
    );

    return (
        <Pusher
            ariaLabel="Close tab"
            onClick={() => closeTab(currTabCtx.tab().id)}
            class={`${styles.tab.closeBtn({ visible: shouldShow() })}`}
            icon={<CrossIcon size={10} />}
        />
    );
};

