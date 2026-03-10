import { Button } from "@kobalte/core/button";
import { JSX, ParentComponent } from "solid-js";
import { usePreventEvent } from "../hooks/usePreventEvent";

interface PushButtonProps {
    class?: string;
    disabled?: boolean;
    ariaLabel?: string;

    icon?: JSX.Element;
    children?: JSX.Element;

    onClick?: (e: MouseEvent) => void;
    isolate?: boolean;
}

export const Pusher: ParentComponent<PushButtonProps> = (props) => {
    const { stopPropagation, preventDefault } = usePreventEvent(props.isolate);

    return (
        <Button
            type="button"
            disabled={props.disabled}
            aria-label={props.ariaLabel}
            class={`${props.class ?? ""} data-disabled:cursor-default select-none`}
            onPointerDown={(e) => {
                stopPropagation(e);
                preventDefault(e);
            }}
            onClick={(e) => {
                stopPropagation(e);
                preventDefault(e);
                props.onClick?.(e);
            }}
        >
            {props.icon}
            {props.children}
        </Button>
    );
};

