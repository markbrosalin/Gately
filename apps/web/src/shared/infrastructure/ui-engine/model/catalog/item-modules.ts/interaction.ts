import { CatalogModuleBase } from ".";
import { CatalogExtensions } from "../item";

export type CatalogInteractionModule = CatalogModuleBase<
    "interaction",
    {
        handler: string;
        params?: CatalogExtensions;
    }
>;

