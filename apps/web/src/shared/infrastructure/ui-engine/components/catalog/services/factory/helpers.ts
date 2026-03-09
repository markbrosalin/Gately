import type { CatalogItem } from "engine-model/catalog";
import * as Model from "engine-model/catalog";
import { DEFAULT_ITEM_LAYOUT } from "./constants";
import type { CatalogCreateItemInput } from "./types";

export const createTimestamps = (
    createdAt?: number,
    updatedAt?: number,
): {
    createdAt: number;
    updatedAt?: number;
} => {
    const nextCreatedAt = createdAt ?? Date.now();

    return {
        createdAt: nextCreatedAt,
        ...(updatedAt !== undefined ? { updatedAt } : {}),
    };
};

export const createBaseItemData = (input: CatalogCreateItemInput) => {
    const timestamps = createTimestamps();

    return {
        ref: input.ref,
        meta: {
            name: input.name,
            ...timestamps,
            ...(input.description !== undefined ? { description: input.description } : {}),
            ...(input.tags !== undefined ? { tags: input.tags } : {}),
            ...(input.metaExtensions !== undefined ? { extensions: input.metaExtensions } : {}),
        },
        layout: {
            ...DEFAULT_ITEM_LAYOUT,
            ...input.layout,
        },
        ...(input.extensions !== undefined ? { extensions: input.extensions } : {}),
    };
};

const _normalizeItemModule = (module: Model.CatalogItemModule): Model.CatalogItemModule => {
    if (module.type !== "composition") {
        return module;
    }

    return {
        ...module,
        config: {
            ...module.config,
            contentJson: module.config.contentJson ?? "",
            boundary: {
                inputs: module.config.boundary?.inputs ?? [],
                outputs: module.config.boundary?.outputs ?? [],
            },
        },
    };
};

const _normalizeItemModules = <TModule extends Model.CatalogItemModule>(
    modules?: TModule[],
): TModule[] => {
    return modules?.map((module) => _normalizeItemModule(module) as TModule) ?? [];
};

export const createItemByKind = (input: CatalogCreateItemInput): CatalogItem => {
    switch (input.kind) {
        case "logic": {
            return {
                ...createBaseItemData(input),
                kind: "logic",
                modules: _normalizeItemModules(input.modules),
            };
        }
        case "annotation": {
            return {
                ...createBaseItemData(input),
                kind: "annotation",
                modules: _normalizeItemModules(input.modules),
            };
        }
        case "debug": {
            return {
                ...createBaseItemData(input),
                kind: "debug",
                modules: _normalizeItemModules(input.modules),
            };
        }
        case "layout": {
            return {
                ...createBaseItemData(input),
                kind: "layout",
                modules: _normalizeItemModules(input.modules),
            };
        }
        default: {
            const exhaustiveInput: never = input;
            throw new Error(
                `[UIEngine.catalogFactory.createItem]: unsupported item kind "${String(exhaustiveInput)}"`,
            );
        }
    }
};
