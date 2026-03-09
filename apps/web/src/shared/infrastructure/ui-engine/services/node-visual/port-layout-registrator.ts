import { Graph } from "@antv/x6";
import type { XYOffset } from "@gately/shared/types";
import { GRID_SIZE, NODE_INSET, NODE_PORT_LAYOUTS } from "../../model/constants";
import type { PortSide } from "../../model/types";
import type { VisualPortLayoutRegistratorContract } from "./types";

let registered = false;

const buildSideLayout = (side: PortSide) => {
    return (
        portsPositionArgs: Partial<XYOffset>[],
        elemBBox: { x: number; y: number; width: number; height: number },
        groupPositionArgs: Partial<XYOffset> = {},
    ) => {
        const gap = GRID_SIZE;
        const paddingTop = GRID_SIZE;
        const baseX =
            side === "left" ? elemBBox.x + NODE_INSET : elemBBox.x + elemBBox.width - NODE_INSET;
        const startY = elemBBox.y + paddingTop + NODE_INSET;

        return portsPositionArgs.map((args, index) => {
            const dx = (groupPositionArgs.dx ?? 0) + (args.dx ?? 0);
            const dy = (groupPositionArgs.dy ?? 0) + (args.dy ?? 0);
            const x = Math.round(baseX + dx);
            const y = Math.round(startY + index * gap + dy);
            return { position: { x, y }, angle: 0, ...args };
        });
    };
};

const buildBottomLayout = (
    portsPositionArgs: Partial<XYOffset>[],
    elemBBox: { x: number; y: number; width: number; height: number },
    groupPositionArgs: Partial<XYOffset> = {},
) => {
    const gap = GRID_SIZE;
    const centerX = elemBBox.x + elemBBox.width / 2;
    const baseY = elemBBox.y + elemBBox.height - NODE_INSET;
    const count = portsPositionArgs.length;
    const startX = centerX - (Math.max(0, count - 1) * gap) / 2;

    return portsPositionArgs.map((args, index) => {
        const dx = (groupPositionArgs.dx ?? 0) + (args.dx ?? 0);
        const dy = (groupPositionArgs.dy ?? 0) + (args.dy ?? 0);
        const x = Math.round(startX + index * gap + dx);
        const y = Math.round(baseY + dy);
        return { position: { x, y }, angle: 0, ...args };
    });
};

const buildTopLayout = (
    portsPositionArgs: Partial<XYOffset>[],
    elemBBox: { x: number; y: number; width: number; height: number },
    groupPositionArgs: Partial<XYOffset> = {},
) => {
    const gap = GRID_SIZE;
    const centerX = elemBBox.x + elemBBox.width / 2;
    const baseY = elemBBox.y + NODE_INSET;
    const count = portsPositionArgs.length;
    const startX = centerX - (Math.max(0, count - 1) * gap) / 2;

    return portsPositionArgs.map((args, index) => {
        const dx = (groupPositionArgs.dx ?? 0) + (args.dx ?? 0);
        const dy = (groupPositionArgs.dy ?? 0) + (args.dy ?? 0);
        const x = Math.round(startX + index * gap + dx);
        const y = Math.round(baseY + dy);
        return { position: { x, y }, angle: 0, ...args };
    });
};

export const useVisualPortLayoutRegistrator = (): VisualPortLayoutRegistratorContract => {
    const registerNodePortLayouts = (): void => {
        if (registered) return;

        Graph.registerPortLayout(NODE_PORT_LAYOUTS.left, buildSideLayout("left"), true);
        Graph.registerPortLayout(NODE_PORT_LAYOUTS.right, buildSideLayout("right"), true);
        Graph.registerPortLayout(NODE_PORT_LAYOUTS.top, buildTopLayout, true);
        Graph.registerPortLayout(NODE_PORT_LAYOUTS.bottom, buildBottomLayout, true);

        registered = true;
    };

    return {
        registerPortLayouts: registerNodePortLayouts,
    };
};
