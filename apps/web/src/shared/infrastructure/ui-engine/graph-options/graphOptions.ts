import { GraphManual } from "@antv/x6";
import { createConnectingConfig } from "./connecting";
import type { UIEngineContext } from "../model";
import { GRID_SIZE } from "../model";

export const makeGraphOptions = (
    container: HTMLDivElement,
    ctx: UIEngineContext,
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

    onPortRendered({ node, contentContainer, port, contentSelectors }) {
        const circle = contentSelectors?.circle as Element;
        if (!circle) return;
        const cache = ctx.getService("cache");
        cache.ports.save(node, port.id, { port: circle });

        contentContainer.addEventListener("mousedown", () => node.toFront());
    },
});

