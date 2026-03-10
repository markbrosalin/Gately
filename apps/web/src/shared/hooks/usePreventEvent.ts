export const usePreventEvent = (isolate: boolean | undefined = true) => {
    const stopPropagation = (e: Event) => {
        if (!isolate) return;
        e.stopPropagation();
    };

    const preventDefault = (e: Event) => {
        if (!isolate) return;
        e.preventDefault();
    };

    return { stopPropagation, preventDefault };
};

