import { Accessor, JSX } from "solid-js";
import { Axis } from "../../types";

export type ListScrollerDirection = "left" | "right";

export type ListScrollerRootProps = {
    scrollRef?: Accessor<HTMLElement | undefined>;
    activeKey?: Accessor<unknown>;
    activeSelector?: string;
    padding?: number;
    behavior?: ScrollBehavior;
    step?: number;
    wheel?: boolean;
    wheelMultiplier?: number;
    epsilon?: number;
    children: JSX.Element;
};

export type ListScrollerListProps = JSX.HTMLAttributes<HTMLDivElement>;

export type ListScrollerTriggerRenderProps = {
    disabled: boolean;
    onClick: () => void;
    direction: ListScrollerDirection;
};

export type ListScrollerTriggerProps = {
    direction: ListScrollerDirection;
    children: (props: ListScrollerTriggerRenderProps) => JSX.Element;
};

export type ListScrollerContainerProps = {
    axis?: Axis;
    class?: string;
    children: JSX.Element;
};

