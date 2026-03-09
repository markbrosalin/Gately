import { CatalogModuleBase } from ".";
import { CatalogExtensions } from "../item";

export type CatalogPortDirection = "input" | "output";
export type CatalogPortAnchor = "left" | "right" | "top" | "bottom";

export type CatalogPortSpec = {
    id: string;
    direction: CatalogPortDirection;
    title?: string;
    description?: string;
    anchor?: CatalogPortAnchor;
    order?: number;
    offset?: number;
    extensions?: CatalogExtensions;
};

export type CatalogPortsModule = CatalogModuleBase<
    "ports",
    {
        items: CatalogPortSpec[];
    }
>;
