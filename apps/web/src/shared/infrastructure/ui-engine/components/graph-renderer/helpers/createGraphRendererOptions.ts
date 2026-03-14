import type { GraphManual } from "@antv/x6";
import { GRID_SIZE } from "@engine-model/constants";

export const createGraphRendererOptions = (
    container: HTMLDivElement,
    connecting: GraphManual["connecting"],
): Partial<GraphManual> => ({
    container,
    async: true,
    grid: {
        args: { thickness: 2, color: "#A4B7D2" },
        size: GRID_SIZE,
        type: "dot",
        visible: true,
    },
    virtual: { enabled: true, margin: 400 },
    autoResize: true,
    mousewheel: {
        enabled: true,
        minScale: 0.2,
        maxScale: 4,
        zoomAtMousePosition: true,
    },
    panning: {
        enabled: true,
        eventTypes: ["mouseWheelDown"],
    },
    connecting,
    preventDefaultBlankAction: true,
    preventDefaultContextMenu: true,
    preventDefaultDblClick: true,
    preventDefaultMouseDown: true,
});


