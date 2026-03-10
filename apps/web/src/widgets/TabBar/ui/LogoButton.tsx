import { LogoIcon } from "@gately/shared/assets/IconComponents";
import { Toggler } from "@gately/shared/ui/Toggler";
import { Component } from "solid-js";
import { tabBarStyles as styles } from "./styles";

export const LogoButton: Component<{ class?: string }> = (props) => {
    return (
        <Toggler ariaLabel="Logo" class={`${styles.buttons()} ${props.class} group`}>
            <span class="group-active:hidden group-data-pressed:hidden full-size">
                <LogoIcon type="default" />
            </span>
            <span class="hidden group-active:inline group-data-pressed:inline full-size">
                <LogoIcon type="pressed" />
            </span>
        </Toggler>
    );
};

