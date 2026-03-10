import { Metadata } from "@antv/x6/lib/model/port";
import { MarkupJSONMarkup } from "@antv/x6/lib/view/markup";
import { NODE_INSET, NODE_PORT_LAYOUTS, STROKE_WIDTH } from "@engine-model/constants";

type BaseNodeAttrsOptions = {
    minWidth: number;
    minHeight: number;
};

export const buildStdLogicItemMarkup = (
    props: {
        beforeBody?: MarkupJSONMarkup[];
        beforeIcon?: MarkupJSONMarkup[];
        afterIcon?: MarkupJSONMarkup[];
    } = {},
): MarkupJSONMarkup[] => [
    {
        tagName: "g",
        className: "base-node",
        children: [
            ...(props.beforeBody ?? []),
            { tagName: "rect", selector: "body" },
            ...(props.beforeIcon ?? []),
            { tagName: "path", selector: "icon" },
            ...(props.afterIcon ?? []),
        ],
    },
];

export const buildStdLogicItemPorts = (): Metadata => ({
    items: [],
    groups: {
        left: {
            position: { name: NODE_PORT_LAYOUTS.left },
            attrs: {
                circle: {
                    magnet: true,
                    class: "port port-input",
                },
            },
        },
        right: {
            position: { name: NODE_PORT_LAYOUTS.right },
            attrs: {
                circle: {
                    magnet: true,
                    class: "port port-output",
                },
            },
        },
        bottom: {
            position: { name: NODE_PORT_LAYOUTS.bottom },
            attrs: {
                circle: {
                    magnet: true,
                    class: "port port-input",
                },
            },
        },
    },
});

export const buildStdLogicItemAttrs = (options: BaseNodeAttrsOptions) => {
    return {
        body: {
            x: NODE_INSET,
            y: NODE_INSET,
            width: options.minWidth,
            height: options.minHeight,
            strokeWidth: STROKE_WIDTH,
            "stroke-linejoin": "round",
            "stroke-linecap": "round",

            rx: 4,
            ry: 4,

            fill: "var(--color-gray-1)",
            stroke: "var(--color-gray-11)",
        },
        icon: {
            stroke: "var(--color-gray-9)",
            "stroke-width": 2,
            "stroke-linejoin": "round",
            "stroke-linecap": "round",
            fill: "none",

            ref: "body",
            refX: "50%",
            refY: "50%",
        },
    };
};


