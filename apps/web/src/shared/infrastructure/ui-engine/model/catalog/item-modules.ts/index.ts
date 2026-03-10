import type { CatalogExtensions } from "../item";
import { CatalogCompositionModule } from "./composition";
import { CatalogInteractionModule } from "./interaction";
import { CatalogLogicModule } from "./logic";
import { CatalogPortsModule } from "./port";
import { CatalogTimingModule } from "./timing";
import { CatalogVisualModule } from "./visual";

export * from "./visual";
export * from "./logic";
export * from "./interaction";
export * from "./port";
export * from "./composition";
export * from "./timing";

export type CatalogModuleBase<TType extends string, TConfig extends object> = {
    type: TType;
    config: TConfig;
    extensions?: CatalogExtensions;
};

export type CatalogItemModule =
    | CatalogLogicModule
    | CatalogPortsModule
    | CatalogInteractionModule
    | CatalogTimingModule
    | CatalogCompositionModule
    | CatalogVisualModule;

export type CatalogItemModuleType = CatalogItemModule["type"];

