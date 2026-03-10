import { tv } from "tailwind-variants";

const buttonBase = `flex h-full font-bold-main outline-none
text-gray-6 bg-gray-12 inline-flex items-center justify-center
hover:text-gray-1 hover:bg-gray-11 hover:cursor-pointer
data-disabled:bg-gray-12 data-disabled:text-gray-10 data-disabled:cursor-default
transition-colors duration-100
`;

const TabBarButtonStyles = tv({
    base: `${buttonBase} aspect-square
    active:bg-primary-9 active:text-gray-1
    data-pressed:bg-primary-9 data-pressed:text-gray-1
    `,
});

const tabWrap = tv({
    base: "relative h-full max-w-40 min-w-40 group",
});

const tabTrigger = tv({
    base: `${buttonBase}
    peer w-full px-5 pr-9 justify-start
    data-selected:bg-primary-9 data-selected:text-gray-1 data-selected:cursor-default
  `,
});

const tabTitle = tv({
    base: "truncate select-none",
});

export const tabEditOverlay = tv({
    base: "absolute inset-0 z-20 px-5 flex items-center",
});

const tabCloseBtn = tv({
    base: `
    absolute right-0 top-1/2 -translate-y-1/2 z-30
    pr-3 transition-opacity duration-100
    text-gray-8 hover:text-gray-1
    peer-data-selected:text-gray-1
    hover:cursor-pointer
  `,
    variants: {
        visible: {
            true: "opacity-100 pointer-events-auto",
            false: "opacity-0 pointer-events-none",
        },
    },
});

export const tabBarStyles = {
    tab: {
        trigger: tabTrigger,
        title: tabTitle,
        wrap: tabWrap,
        closeBtn: tabCloseBtn,
    },
    buttons: TabBarButtonStyles,
};

