import { CatalogModuleBase } from ".";

export type CatalogTimingModule = CatalogModuleBase<
    "timing",
    {
        rise: number;
        fall: number;
    }
>;

