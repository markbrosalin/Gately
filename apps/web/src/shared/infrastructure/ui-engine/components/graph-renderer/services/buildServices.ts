import { buildContextServiceRegistry } from "@gately/shared/infrastructure/ui-engine/lib/registry";
import { createGraphRendererDocumentService } from "./document";
import { createGraphRendererInstanceService } from "./instance";
import { createGraphRendererQueryService } from "./query";
import type {
    GraphRendererServiceContext,
    GraphRendererServiceName,
    GraphRendererServices,
} from "./types";
import type { ServiceDefinitionMap } from "../../../model/core/context";

type GraphRendererServiceDefinitions = ServiceDefinitionMap<
    GraphRendererServiceName,
    GraphRendererServices
>;

const createServiceDefinitions = (
    ctx: GraphRendererServiceContext,
): GraphRendererServiceDefinitions => ({
    instance: {
        create: () => createGraphRendererInstanceService(ctx),
    },
    document: {
        create: () => createGraphRendererDocumentService(ctx.getService("instance")),
        createDeps: ["instance"],
    },
    query: {
        create: () => createGraphRendererQueryService(ctx),
        createDeps: ["instance"],
    },
});

export const buildGraphRendererServices = (
    ctx: GraphRendererServiceContext,
): GraphRendererServices => {
    const definitions = createServiceDefinitions(ctx);
    const { services } = buildContextServiceRegistry<
        GraphRendererServiceName,
        GraphRendererServices
    >(definitions, {
        label: "graph-renderer service",
        ctx,
    });

    return services;
};
