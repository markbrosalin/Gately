import { Component, JSX } from "solid-js";

interface ViewportBoundaryProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export const ViewportBoundary: Component<ViewportBoundaryProps> = (props) => {
    return (
        <div ref={props.ref} class={`relative overflow-auto scrollbar-hide ${props.class}`}>
            {props.children}
        </div>
    );
};

