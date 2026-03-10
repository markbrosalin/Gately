import { ParentComponent, splitProps } from "solid-js";
import { mergeRefs } from "@kobalte/utils";
import { useListScroller } from "./context";
import type { ListScrollerListProps } from "./types";

export const ListScrollerList: ParentComponent<ListScrollerListProps> = (props) => {
    const ctx = useListScroller();
    const [local, others] = splitProps(props, ["ref"]);
    const setRef = mergeRefs((el: HTMLDivElement) => ctx.setListRef(el), local.ref);

    return <div {...others} ref={setRef} />;
};

