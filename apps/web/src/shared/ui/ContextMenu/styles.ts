import { tv } from "tailwind-variants";

const contextMenuTrigger = tv({
    base: "contents",
});

const contextMenuContent = tv({
    base: `
    z-100 min-w-50 rounded-md py-2 border border-gray-4
    bg-gray-1 shadow-[0_8px_16px_rgba(15,23,42,0.10)]
    outline-none
    `,
});

const contextMenuItem = tv({
    base: `
    flex items-center gap-6 px-4 py-1
    font-regular-main leading-5 text-gray-12
    select-none outline-none
    data-highlighted:bg-gray-3
    data-disabled:text-gray-10 data-disabled:pointer-events-none
    `,
});

const contextMenuItemLabel = tv({
    base: "flex-1 text-left",
});

const contextMenuItemShortcut = tv({
    base: "text-regular-main tracking-[0.02em] text-gray-10",
});

const contextMenuSeparator = tv({
    base: "my-2 h-px border-0 border-t border-gray-4",
});

export const contextMenuStyles = {
    trigger: contextMenuTrigger,
    content: contextMenuContent,
    item: contextMenuItem,
    itemLabel: contextMenuItemLabel,
    itemShortcut: contextMenuItemShortcut,
    separator: contextMenuSeparator,
};

