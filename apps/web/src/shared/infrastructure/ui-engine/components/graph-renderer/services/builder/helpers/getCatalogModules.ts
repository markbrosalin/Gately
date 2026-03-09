import type { CatalogItem } from "engine-model/catalog";

export const getVisualModule = (item: CatalogItem) =>
    item.modules.find((module) => module.type === "visual");

export const getPortsModule = (item: CatalogItem) =>
    item.modules.find((module) => module.type === "ports");
