import { STROKE_WIDTH, type UIEngineNodeProps } from "@engine-model";
import type { CatalogLogicItem, CatalogItemLayout } from "@engine-model/catalog";
import { createCatalogItemRefKey } from "@engine-model/catalog/lib";
import { DEFAULT_NODE_POSITION } from "../../constants";
import type { GraphRendererBuildNodeInput } from "../../types";
import { ensurePositiveDimension } from "../../helpers";
import { applyCatalogVisualPatch, buildLogicPorts } from "./helpers";
import type { GraphRendererItemBuilderStrategy } from "../types";

const ensurePositiveLayoutDimensions = (
    layout: CatalogItemLayout,
): Required<Omit<CatalogItemLayout, "extensions">> => {
    const width = ensurePositiveDimension(layout.width, "layout.width");
    const height = ensurePositiveDimension(layout.height, "layout.height");
    const minWidth = ensurePositiveDimension(layout.minWidth ?? width, "layout.minWidth");
    const minHeight = ensurePositiveDimension(layout.minHeight ?? height, "layout.minHeight");

    return { width, height, minHeight, minWidth };
};

export const createGraphRendererLogicItemBuilder =
    (): GraphRendererItemBuilderStrategy<CatalogLogicItem> => {
        const buildNodeProps = ({
            item,
            position,
        }: Omit<GraphRendererBuildNodeInput, "item"> & {
            item: CatalogLogicItem;
        }): UIEngineNodeProps => {
            const { width, height, minHeight, minWidth } = ensurePositiveLayoutDimensions(
                item.layout,
            );
            const { attrs, markup } = applyCatalogVisualPatch(item, {
                minWidth,
                minHeight,
            });
            const nextPosition = position ?? DEFAULT_NODE_POSITION;

            return {
                x: nextPosition.x,
                y: nextPosition.y,
                width: width + STROKE_WIDTH,
                height: height + STROKE_WIDTH,
                markup,
                attrs,
                ports: buildLogicPorts(item),
                data: {
                    ref: item.ref,
                    refKey: createCatalogItemRefKey(item.ref),
                    kind: item.kind,
                },
            };
        };

        return {
            buildNodeProps,
        };
    };


