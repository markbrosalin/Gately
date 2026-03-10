import { buildContextServiceRegistry } from "@gately/shared/infrastructure/ui-engine/lib/registry";
import { createCatalogFactoryService } from "./factory";
import { createCatalogIOService } from "./io";
import { createCatalogQueryService } from "./query";
import { createCatalogStateService } from "./state";
import { createCatalogValidationService } from "./validation";
import type {
    CatalogServiceContext,
    CatalogServiceDefinitions,
    CatalogServiceName,
    CatalogServices,
} from "./types";

/** Builds the local service graph for the catalog component. */
const createServiceDefinitions = (ctx: CatalogServiceContext): CatalogServiceDefinitions => ({
    state: {
        create: () => createCatalogStateService(),
    },
    factory: {
        create: () => createCatalogFactoryService(),
    },
    validation: {
        create: () => createCatalogValidationService(),
    },
    query: {
        create: () => createCatalogQueryService(ctx),
        createDeps: ["state"],
    },
    io: {
        create: () => createCatalogIOService(ctx),
        createDeps: ["query", "validation"],
    },
});

export const buildCatalogServices = (ctx: CatalogServiceContext): CatalogServices => {
    const definitions = createServiceDefinitions(ctx);
    const { services } = buildContextServiceRegistry<CatalogServiceName, CatalogServices>(
        definitions,
        {
            label: "catalog service",
            ctx,
        },
    );

    return services;
};

