export type NodeSize = { width: number; height: number };

export type NodeSizeInput = {
    minWidth: number;
    minHeight: number;
    pinCount?: number;
    contentWidth?: number;
    contentHeight?: number;
    pinGap?: number;
};

export const calcNodeSize = (args: NodeSizeInput): NodeSize => {
    const minWidth = args.minWidth;
    const minHeight = args.minHeight;
    const pinGap = args.pinGap ?? 16;
    const pinCount = Math.max(0, args.pinCount ?? 0);
    const contentWidth = args.contentWidth ?? 0;
    const contentHeight = args.contentHeight ?? 0;

    const pinsHeight = pinGap + pinCount * pinGap;

    return {
        width: Math.max(minWidth, contentWidth),
        height: Math.max(minHeight, contentHeight, pinsHeight),
    };
};

