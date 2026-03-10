import { JSX, ParentComponent } from "solid-js";
import { ToggleButton } from "@kobalte/core/toggle-button";
import { usePreventEvent } from "../hooks/usePreventEvent";

interface ToggleIconButtonProps {
    class?: string;
    disabled?: boolean;
    ariaLabel?: string;

    icon?: JSX.Element;
    children?: JSX.Element;

    pressed?: boolean;
    defaultPressed?: boolean;
    onChange?: (pressed: boolean) => void;

    isolate?: boolean;
}

export const Toggler: ParentComponent<ToggleIconButtonProps> = (props) => {
    const { stopPropagation, preventDefault } = usePreventEvent(props.isolate);

    return (
        <ToggleButton
            disabled={props.disabled}
            aria-label={props.ariaLabel}
            class={`${props.class ?? ""} data-disabled:cursor-default select-none`}
            pressed={props.pressed}
            defaultPressed={props.defaultPressed}
            onChange={props.onChange}
            onPointerDown={(e) => {
                stopPropagation(e);
                preventDefault(e);
            }}
            onClick={(e) => {
                stopPropagation(e);
                preventDefault(e);
            }}
        >
            {props.icon}
            {props.children}
        </ToggleButton>
    );
};

