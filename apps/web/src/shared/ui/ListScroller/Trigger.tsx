import { Component, createMemo } from "solid-js";
import { useListScroller } from "./context";
import type { ListScrollerTriggerProps } from "./types";

export const ListScrollerTrigger: Component<ListScrollerTriggerProps> = (props) => {
    const ctx = useListScroller();
    const isDisabled = () => (props.direction === "left" ? !ctx.canLeft() : !ctx.canRight());
    const handleClick = () => {
        if (isDisabled()) return;
        ctx.scrollStep(props.direction === "left" ? -1 : 1);
    };

    const content = createMemo(() =>
        props.children({
            disabled: isDisabled(),
            onClick: handleClick,
            direction: props.direction,
        }),
    );

    return <>{content()}</>;
};

