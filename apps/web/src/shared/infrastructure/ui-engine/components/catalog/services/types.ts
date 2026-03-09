import { ComponentServiceContext, ServiceDefinitionMap } from "engine-model";
import type { CatalogExternal } from "../types";
import type { CatalogFactoryService } from "./factory";
import type { CatalogIOService } from "./io";
import type { CatalogQueryService } from "./query";
import type { CatalogStateService } from "./state";
import type { CatalogValidationService } from "./validation";

export type CatalogServiceName = "state" | "query" | "factory" | "validation" | "io";

export type CatalogServices = {
    state: CatalogStateService;
    query: CatalogQueryService;
    factory: CatalogFactoryService;
    validation: CatalogValidationService;
    io: CatalogIOService;
};

export type CatalogServiceDefinitions = ServiceDefinitionMap<CatalogServiceName, CatalogServices>;

export type CatalogServiceContext = ComponentServiceContext<
    CatalogExternal,
    CatalogServiceName,
    CatalogServices
>;
