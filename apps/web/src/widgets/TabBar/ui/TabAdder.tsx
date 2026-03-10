import { Component } from "solid-js";
import { PlusIcon } from "@gately/shared/assets/IconComponents";
import { Pusher } from "@gately/shared/ui/Pusher";
import { useOpenNewTab } from "@gately/features/tabs/useOpenTab";
import { tabBarStyles as styles } from "./styles";

export const TabAdder: Component<{ class?: string }> = (props) => {
    const { openNewTab } = useOpenNewTab();

    const handleClick = async () => {
        try {
            const newTab = await openNewTab({ options: { setActive: true } });
            console.log("Tab created:", newTab);
        } catch (err) {
            console.error("Failed to create tab:", err);
        }
    };

    return (
        <Pusher
            ariaLabel="Add new tab"
            icon={<PlusIcon />}
            class={`${styles.buttons()} ${props.class}`}
            onClick={handleClick}
        ></Pusher>
    );
};

