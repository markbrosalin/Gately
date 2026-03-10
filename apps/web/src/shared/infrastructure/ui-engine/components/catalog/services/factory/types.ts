import * as Model from "@engine-model/catalog";

export type CatalogCreateLibraryInput = Pick<Model.CatalogLibraryManifest, "id" | "name"> &
    Partial<Pick<Model.CatalogLibraryManifest, "version" | "description">> & {
        items?: Model.CatalogItem[];
        extensions?: Model.CatalogLibraryDocument["extensions"];
        manifestExtensions?: Model.CatalogLibraryManifest["extensions"];
    };

type CatalogCreateItemBaseInput<
    TKind extends Model.CatalogItemKind,
    TModules extends Model.CatalogItemModule,
> = {
    kind: TKind;
} & Pick<Model.CatalogItem, "ref"> &
    Pick<Model.CatalogItemMeta, "name"> &
    Partial<Pick<Model.CatalogItemMeta, "tags" | "description">> & {
        layout?: Partial<Model.CatalogItemLayout>;
        modules?: TModules[];
        extensions?: Model.CatalogItem["extensions"];
        metaExtensions?: Model.CatalogItemMeta["extensions"];
    };

export type CatalogCreateLogicItemInput = CatalogCreateItemBaseInput<
    "logic",
    | Model.CatalogLogicModule
    | Model.CatalogCompositionModule
    | Model.CatalogPortsModule
    | Model.CatalogInteractionModule
    | Model.CatalogTimingModule
>;

export type CatalogCreateAnnotationItemInput = CatalogCreateItemBaseInput<
    "annotation",
    Model.CatalogInteractionModule
>;

export type CatalogCreateDebugItemInput = CatalogCreateItemBaseInput<
    "debug",
    Model.CatalogInteractionModule
>;

export type CatalogCreateLayoutItemInput = CatalogCreateItemBaseInput<
    "layout",
    Model.CatalogInteractionModule
>;

export type CatalogCreateItemInput =
    | CatalogCreateLogicItemInput
    | CatalogCreateAnnotationItemInput
    | CatalogCreateDebugItemInput
    | CatalogCreateLayoutItemInput;

export type CatalogFactoryService = {
    createLibrary: (input: CatalogCreateLibraryInput) => Model.CatalogLibraryDocument;
    createItem: (input: CatalogCreateItemInput) => Model.CatalogItem;
};
