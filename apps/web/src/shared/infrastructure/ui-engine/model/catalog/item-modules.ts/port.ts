import { CatalogModuleBase } from ".";
import { CatalogExtensions } from "../item";

export type CatalogPortAnchor = "left" | "right" | "top" | "bottom";
export type CatalogPortsSide = "inputs" | "outputs";

export type CatalogPortSpec = {
    id: string;
    title?: string;
    description?: string;
    anchor?: CatalogPortAnchor;
    offset?: number;
    extensions?: CatalogExtensions;
};

export type CatalogPortsModule = CatalogModuleBase<
    "ports",
    {
        inputs?: CatalogPortSpec[];
        outputs?: CatalogPortSpec[];
    }
>;

