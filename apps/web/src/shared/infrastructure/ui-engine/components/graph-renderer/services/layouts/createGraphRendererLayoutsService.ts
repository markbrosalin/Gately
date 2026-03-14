import { Graph } from "@antv/x6";
import type { XYOffset } from "@gately/shared/types";
import { GRID_SIZE, NODE_INSET, NODE_PORT_LAYOUTS } from "@engine-model/constants";
import type { CatalogPortAnchor } from "@engine-model/catalog";
import type { GraphRendererLayoutsService } from "./types";

let registered = false;

type LayoutBBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};

const buildVerticalLayout = (side: Extract<CatalogPortAnchor, "left" | "right">) => {
    return (
        portsPositionArgs: Partial<XYOffset>[],
        elemBBox: LayoutBBox,
        groupPositionArgs: Partial<XYOffset> = {},
    ) => {
        const gap = GRID_SIZE;
        const paddingTop = GRID_SIZE;
        const baseX = (side === "left" ? elemBBox.x : elemBBox.x + elemBBox.width) + NODE_INSET;
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

const buildHorizontalLayout = (side: Extract<CatalogPortAnchor, "top" | "bottom">) => {
    return (
        portsPositionArgs: Partial<XYOffset>[],
        elemBBox: LayoutBBox,
        groupPositionArgs: Partial<XYOffset> = {},
    ) => {
        const gap = GRID_SIZE;
        const centerX = elemBBox.x + elemBBox.width / 2 + NODE_INSET;
        const baseY = side === "top" ? elemBBox.y + NODE_INSET : elemBBox.y + elemBBox.height;
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
};

export const createGraphRendererLayoutsService = (): GraphRendererLayoutsService => {
    const registerPortLayouts = (): void => {
        if (registered) {
            return;
        }

        Graph.registerPortLayout(NODE_PORT_LAYOUTS.left, buildVerticalLayout("left"), true);
        Graph.registerPortLayout(NODE_PORT_LAYOUTS.right, buildVerticalLayout("right"), true);
        Graph.registerPortLayout(NODE_PORT_LAYOUTS.top, buildHorizontalLayout("top"), true);
        Graph.registerPortLayout(NODE_PORT_LAYOUTS.bottom, buildHorizontalLayout("bottom"), true);

        registered = true;
    };

    return {
        registerPortLayouts,
    };
};
