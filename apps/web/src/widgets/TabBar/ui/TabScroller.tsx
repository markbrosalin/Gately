import { Pusher } from "@gately/shared/ui";
import { Component } from "solid-js";
import { tabBarStyles as styles } from "./styles";
import { ListScroller } from "@gately/shared/ui/ListScroller/ListScroller";
import { ArrowIcon } from "@gately/shared/assets/IconComponents";

export const TabScroller: Component<{ class?: string }> = (props) => {
    return (
        <ListScroller.Container class={props.class ?? ""}>
            <ListScroller.Trigger direction="left">
                {(p) => (
                    <Pusher
                        ariaLabel="Scroll tabs leftwards"
                        icon={<ArrowIcon direction="left" />}
                        class={styles.buttons()}
                        disabled={p.disabled}
                        onClick={p.onClick}
                    ></Pusher>
                )}
            </ListScroller.Trigger>
            <ListScroller.Trigger direction="right">
                {(p) => (
                    <Pusher
                        ariaLabel="Scroll tabs rightwards"
                        icon={<ArrowIcon direction="right" />}
                        class={styles.buttons()}
                        disabled={p.disabled}
                        onClick={p.onClick}
                    ></Pusher>
                )}
            </ListScroller.Trigger>
        </ListScroller.Container>
    );
};

