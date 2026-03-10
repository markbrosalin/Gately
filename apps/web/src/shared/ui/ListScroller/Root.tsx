import { ParentComponent, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { ListScrollerProvider, ListScrollerContextValue } from "./context";
import type { ListScrollerRootProps } from "./types";

export const ListScrollerRoot: ParentComponent<ListScrollerRootProps> = (props) => {
    const activeSelector = () => props.activeSelector ?? "[data-selected]";
    const padding = () => props.padding ?? 12;
    const behavior = () => props.behavior ?? "smooth";
    const step = () => props.step ?? 120;
    const wheel = () => props.wheel ?? true;
    const wheelMultiplier = () => props.wheelMultiplier ?? 1;
    const eps = () => props.epsilon ?? 1;

    const [listRef, setListRef] = createSignal<HTMLElement | undefined>();
    const listEl = createMemo(() => props.scrollRef?.() ?? listRef());

    const [canLeft, setCanLeft] = createSignal(false);
    const [canRight, setCanRight] = createSignal(false);

    const update = () => {
        const node = listEl();
        if (!node) return;
        const maxLeft = Math.max(0, node.scrollWidth - node.clientWidth);
        setCanLeft(node.scrollLeft > eps());
        setCanRight(maxLeft - node.scrollLeft > eps());
    };

    const revealChildX = (container: HTMLElement, child: HTMLElement, b: ScrollBehavior) => {
        const c = container.getBoundingClientRect();
        const e = child.getBoundingClientRect();

        const leftOverflow = e.left - c.left - padding();
        const rightOverflow = e.right - c.right + padding();

        if (leftOverflow >= 0 && rightOverflow <= 0) return;

        let next = container.scrollLeft;
        if (leftOverflow < 0) next += leftOverflow;
        else if (rightOverflow > 0) next += rightOverflow;

        const max = container.scrollWidth - container.clientWidth;
        if (next < 0) next = 0;
        if (next > max) next = max;

        container.scrollTo({ left: next, behavior: b });
    };

    const revealActive = (b: ScrollBehavior = behavior()) => {
        const node = listEl();
        if (!node) return;
        const active = node.querySelector<HTMLElement>(activeSelector());
        if (!active) return;
        revealChildX(node, active, b);
    };

    const scrollStep = (dir: -1 | 1) => {
        const node = listEl();
        if (!node) return;
        node.scrollBy({ left: dir * step(), behavior: "smooth" });
        requestAnimationFrame(update);
    };

    createEffect(() => {
        const node = listEl();
        if (!node) return;

        const onScroll = () => update();
        node.addEventListener("scroll", onScroll, { passive: true });

        const onWheel = (e: WheelEvent) => {
            if (!wheel()) return;
            if (node.scrollWidth <= node.clientWidth) return;
            if (e.shiftKey) return;

            const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (!raw) return;

            const delta = raw * wheelMultiplier();

            const maxLeft = node.scrollWidth - node.clientWidth;
            if (delta < 0 && node.scrollLeft <= 0) return;
            if (delta > 0 && node.scrollLeft >= maxLeft) return;

            e.preventDefault();
            node.scrollLeft += delta;
            update();
        };
        node.addEventListener("wheel", onWheel, { passive: false });

        const ro = new ResizeObserver(() => {
            update();
            requestAnimationFrame(() => revealActive("auto"));
        });
        ro.observe(node);

        const mo = new MutationObserver(() => {
            update();
            requestAnimationFrame(() => revealActive("auto"));
        });
        mo.observe(node, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["data-selected"],
        });

        update();
        requestAnimationFrame(() => revealActive("auto"));

        onCleanup(() => {
            node.removeEventListener("scroll", onScroll);
            node.removeEventListener("wheel", onWheel as EventListener);
            ro.disconnect();
            mo.disconnect();
        });
    });

    if (props.activeKey) {
        createEffect(() => {
            props.activeKey?.();
            requestAnimationFrame(() => requestAnimationFrame(() => revealActive(behavior())));
        });
    }

    const ctx: ListScrollerContextValue = {
        setListRef,
        canLeft,
        canRight,
        scrollStep,
        revealActive,
    };

    return <ListScrollerProvider value={ctx}>{props.children}</ListScrollerProvider>;
};

