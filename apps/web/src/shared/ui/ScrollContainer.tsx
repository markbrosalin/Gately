import { ParentComponent } from "solid-js";
import { Axis } from "../types";

const ScrollContainer: ParentComponent<{
    axis?: Axis;
    class?: string;
}> = (props) => {
    const axis = props.axis ?? "x";
    const direction = axis === "x" ? "flex-row" : "flex-col";

    return <div class={`flex ${direction} ${props.class}`}>{props.children}</div>;
};

export default ScrollContainer;

