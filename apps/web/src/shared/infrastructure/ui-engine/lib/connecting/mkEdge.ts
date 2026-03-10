import { Shape } from "@antv/x6";

export const mkEdge = () =>
    new Shape.Edge({
        attrs: {
            line: {
                class: "connection",
                strokeWidth: 2.5,
                targetMarker: false,
                sourceMarker: false,
            },
        },
        zIndex: 0,
    });

