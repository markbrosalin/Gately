import type { CatalogItem } from "@engine-model/catalog";
import type { GraphRendererBuildNodeInput, GraphRendererBuilderService } from "../types";

export type GraphRendererItemBuilderStrategy<TItem extends CatalogItem = CatalogItem> = {
    buildNodeProps: (
        input: Omit<GraphRendererBuildNodeInput, "item"> & {
            item: TItem;
        },
    ) => ReturnType<GraphRendererBuilderService["buildNodeProps"]>;
};


