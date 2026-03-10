import { Accessor, createContext, useContext } from "solid-js";

export type ListScrollerContextValue = {
    setListRef: (el: HTMLElement) => void;
    canLeft: Accessor<boolean>;
    canRight: Accessor<boolean>;
    scrollStep: (dir: -1 | 1) => void;
    revealActive: (behavior?: ScrollBehavior) => void;
};

const ListScrollerCtx = createContext<ListScrollerContextValue>();

export const ListScrollerProvider = ListScrollerCtx.Provider;

export function useListScroller() {
    const ctx = useContext(ListScrollerCtx);
    if (!ctx) throw new Error("ListScroller components must be used inside <ListScroller.Root>");
    return ctx;
}

