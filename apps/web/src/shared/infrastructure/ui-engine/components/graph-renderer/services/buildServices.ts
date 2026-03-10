import { buildContextServiceRegistry } from "@gately/shared/infrastructure/ui-engine/lib/registry";
import { createGraphRendererBuilderService } from "./builder";
import { createGraphRendererDocumentService } from "./document";
import { createGraphRendererInstanceService } from "./instance";
import { createGraphRendererLayoutsService } from "./layouts";
import { createGraphRendererNodesService } from "./nodes";
import { createGraphRendererQueryService } from "./query";
import type {
    GraphRendererServiceContext,
    GraphRendererServiceName,
    GraphRendererServices,
} from "./types";
import type { ServiceDefinitionMap } from "@engine-model/core/context";

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
    layouts: {
        create: () => createGraphRendererLayoutsService(),
    },
    builder: {
        create: () => createGraphRendererBuilderService(),
    },
    nodes: {
        create: () => createGraphRendererNodesService(ctx.getService("instance")),
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


