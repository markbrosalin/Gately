import { MarkupJSONMarkup } from "@antv/x6/lib/view/markup";

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
