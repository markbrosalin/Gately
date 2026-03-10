import { ParentComponent } from "solid-js";
import type { ListScrollerContainerProps } from "./types";

export const ListScrollerContainer: ParentComponent<ListScrollerContainerProps> = (props) => {
    const axis = props.axis ?? "x";
    const direction = axis === "x" ? "flex-row" : "flex-col";

    return <div class={`flex ${direction} ${props.class ?? ""}`}>{props.children}</div>;
};

