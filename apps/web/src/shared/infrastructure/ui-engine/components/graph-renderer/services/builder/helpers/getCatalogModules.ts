import type { CatalogItem, CatalogPortsModule, CatalogVisualModule } from "@engine-model/catalog";

export const getVisualModule = (item: CatalogItem): CatalogVisualModule =>
    item.modules.find((module) => module.type === "visual") as CatalogVisualModule;

export const getPortsModule = (item: CatalogItem): CatalogPortsModule =>
    item.modules.find((module) => module.type === "ports") as CatalogPortsModule;
