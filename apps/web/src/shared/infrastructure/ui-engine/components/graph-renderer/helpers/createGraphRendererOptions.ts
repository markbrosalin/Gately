import type { GraphManual } from "@antv/x6";
import { createConnectingConfig } from "../../../graph-options";
import { GRID_SIZE } from "../../../model";

export const createGraphRendererOptions = (
    container: HTMLDivElement,
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
    connecting: createConnectingConfig("manhattan"),
    preventDefaultBlankAction: true,
    preventDefaultContextMenu: true,
    preventDefaultDblClick: true,
    preventDefaultMouseDown: true,
});
