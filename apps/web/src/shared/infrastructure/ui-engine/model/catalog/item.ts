import { Timestamps } from "../core/entity";
import type {
    CatalogCompositionModule,
    CatalogInteractionModule,
    CatalogItemModule,
    CatalogLogicModule,
    CatalogPortsModule,
    CatalogTimingModule,
    CatalogVisualModule,
} from "./item-modules.ts";
import type { CatalogItemRef } from "./ref";

export type CatalogExtensions = Record<string, unknown>;

export type CatalogItemKind = "logic" | "annotation" | "debug" | "layout";

export type CatalogItemMeta = Timestamps & {
    name: string;
    description?: string;
    tags?: string[];
    extensions?: CatalogExtensions;
};

export type CatalogItemLayout = {
    width: number;
    height: number;
    minWidth?: number;
    minHeight?: number;
    extensions?: CatalogExtensions;
};

type CatalogItemBase<TKind extends CatalogItemKind, TModules extends CatalogItemModule> = {
    ref: CatalogItemRef;
    kind: TKind;
    meta: CatalogItemMeta;
    layout: CatalogItemLayout;
    modules: TModules[];
    extensions?: CatalogExtensions;
};

export type CatalogLogicItem = CatalogItemBase<
    "logic",
    | CatalogLogicModule
    | CatalogCompositionModule
    | CatalogPortsModule
    | CatalogInteractionModule
    | CatalogTimingModule
    | CatalogVisualModule
>;

export type CatalogAnnotationItem = CatalogItemBase<
    "annotation",
    CatalogInteractionModule | CatalogVisualModule
>;

export type CatalogDebugItem = CatalogItemBase<
    "debug",
    CatalogInteractionModule | CatalogVisualModule
>;

export type CatalogLayoutItem = CatalogItemBase<
    "layout",
    CatalogInteractionModule | CatalogVisualModule
>;

export type CatalogItem =
    | CatalogLogicItem
    | CatalogAnnotationItem
    | CatalogDebugItem
    | CatalogLayoutItem;

export type CatalogItemByKind = {
    logic: CatalogLogicItem;
    annotation: CatalogAnnotationItem;
    debug: CatalogDebugItem;
    layout: CatalogLayoutItem;
};

