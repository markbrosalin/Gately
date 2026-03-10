import { Component } from "solid-js";
import { Pusher } from "./Pusher";
import { ArrowIcon } from "../assets/IconComponents";
import { Direction } from "../types";

interface ScrollButtonProps {
    size?: number;
    direction: Direction;
    disabled?: boolean;
    onClick?: () => void;
    class?: string;
}

const ScrollButton: Component<ScrollButtonProps> = (props) => {
    return (
        <Pusher
            ariaLabel={`Scroll ${props.direction}`}
            icon={<ArrowIcon size={props.size} direction={props.direction} />}
            class={`${props.class || ""}`}
            disabled={props.disabled}
            onClick={props.onClick}
        ></Pusher>
    );
};

export default ScrollButton;

