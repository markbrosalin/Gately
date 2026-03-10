import { ListScrollerRoot } from "./Root";
import { ListScrollerList } from "./List";
import { ListScrollerTrigger } from "./Trigger";
import { ListScrollerContainer } from "./Container";

export { useListScroller } from "./context";
export type {
    ListScrollerContainerProps,
    ListScrollerDirection,
    ListScrollerListProps,
    ListScrollerRootProps,
    ListScrollerTriggerProps,
    ListScrollerTriggerRenderProps,
} from "./types";

export { ListScrollerRoot, ListScrollerList, ListScrollerTrigger, ListScrollerContainer };

export const ListScroller = Object.assign(ListScrollerRoot, {
    Root: ListScrollerRoot,
    List: ListScrollerList,
    Trigger: ListScrollerTrigger,
    Container: ListScrollerContainer,
});

