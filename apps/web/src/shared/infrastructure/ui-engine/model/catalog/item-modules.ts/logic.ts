import { CatalogModuleBase } from ".";
import { CatalogExtensions } from "../item";

export type CatalogLogicModule = CatalogModuleBase<
    "logic",
    {
        executor: string;
        params?: CatalogExtensions;
    }
>;

