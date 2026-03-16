import { buildContextServiceRegistry } from "@gately/shared/infrastructure/ui-engine/lib/registry";
import { createGraphRendererBuilderService } from "./builder";
import { createGraphRendererConnectingService } from "./connecting";
import { createGraphRendererDocumentService } from "./document";
import { createGraphRendererInstanceService } from "./instance";
import { createGraphRendererLayoutsService } from "./layouts";
import { createGraphRendererNodesService } from "./nodes";
import { createGraphRendererQueryService } from "./query";
import { createGraphRendererRemovalService } from "./removal";
import { createGraphRendererSelectionService } from "./selection";
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
    connecting: {
        create: () => createGraphRendererConnectingService(),
    },
    instance: {
        create: () =>
            createGraphRendererInstanceService(ctx, ctx.getService("connecting")),
        createDeps: ["connecting"],
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
    selection: {
        create: () => createGraphRendererSelectionService(ctx.getService("instance")),
        createDeps: ["instance"],
    },
    removal: {
        create: () =>
            createGraphRendererRemovalService(
                ctx.getService("instance"),
                ctx.getService("nodes"),
                ctx.getService("selection"),
            ),
        createDeps: ["instance", "nodes", "selection"],
    },
    query: {
        create: () => createGraphRendererQueryService(ctx),
        createDeps: ["instance", "document", "selection"],
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


