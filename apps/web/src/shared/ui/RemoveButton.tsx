import { Component } from "solid-js";
import { CrossIcon } from "../assets/IconComponents";

interface RemoveButtonProps {
    class?: string;
    onClick?: (e: MouseEvent) => void;
    size?: number;
    disabled?: boolean;
}

const RemoveButton: Component<RemoveButtonProps> = (props) => {
    return (
        <button
            title="Close"
            class={`cursor-pointer opacity transition-all duration-100 ease-out
                        hover:opacity-50
                        ${props.class ?? ""}`}
            onclick={(e) => {
                e.stopPropagation();
                props.onClick?.(e);
            }}
            disabled={props.disabled}
        >
            <CrossIcon size={props.size} />
        </button>
    );
};

export default RemoveButton;

