import { buildContextServiceRegistry } from "@gately/shared/infrastructure/ui-engine/lib/registry";
import { createGraphDocumentFactoryService } from "./factory";
import { createGraphDocumentQueryService } from "./query";
import { createGraphDocumentStateService } from "./state";
import type {
    GraphDocumentServiceContext,
    GraphDocumentServiceName,
    GraphDocumentServices,
} from "./types";
import type { ServiceDefinitionMap } from "@engine-model/core/context";

type GraphDocumentServiceDefinitions = ServiceDefinitionMap<
    GraphDocumentServiceName,
    GraphDocumentServices
>;

const createServiceDefinitions = (
    ctx: GraphDocumentServiceContext,
): GraphDocumentServiceDefinitions => ({
    state: {
        create: () => createGraphDocumentStateService(),
    },
    factory: {
        create: () => createGraphDocumentFactoryService(),
    },
    query: {
        create: () => createGraphDocumentQueryService(ctx),
        createDeps: ["state"],
    },
});

export const buildGraphDocumentServices = (
    ctx: GraphDocumentServiceContext,
): GraphDocumentServices => {
    const definitions = createServiceDefinitions(ctx);
    const { services } = buildContextServiceRegistry<
        GraphDocumentServiceName,
        GraphDocumentServices
    >(definitions, {
        label: "graph-document service",
        ctx,
    });

    return services;
};
