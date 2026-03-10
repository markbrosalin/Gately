import type { Graph } from "@antv/x6";
import { buildContextServiceRegistry } from "../../../lib/registry/buildServiceRegistry";
import type { ServiceDefinitionMap, UIEngineContext } from "../../../model";
import { useCacheService } from "../../../services/cache";
import { useEdgeService } from "../../../services/edges";
import { useVisualService } from "../../../services/node-visual";
import { useNodeService } from "../../../services/nodes";
import { usePortService } from "../../../services/ports";
import { useSignalService } from "../../../services/signals";
import { useSnapshotService } from "../../../services/snapshot";
import type { GraphRuntimeServiceName, GraphRuntimeServices } from "./types";

type GraphRuntimeServiceDefinitionMap = {
    [K in GraphRuntimeServiceName]: {
        create: (graph: Graph, ctx: UIEngineContext) => GraphRuntimeServices[K];
        createDeps?: readonly GraphRuntimeServiceName[];
        runtimeDeps?: readonly GraphRuntimeServiceName[];
    };
};

const serviceDefinitions: GraphRuntimeServiceDefinitionMap = {
    cache: {
        create: useCacheService,
    },
    edges: {
        create: useEdgeService,
        createDeps: ["cache"],
        runtimeDeps: ["nodes"],
    },
    nodes: {
        create: useNodeService,
        runtimeDeps: ["node-visual"],
    },
    ports: {
        create: usePortService,
        createDeps: ["cache"],
        runtimeDeps: ["nodes"],
    },
    "node-visual": {
        create: useVisualService,
        runtimeDeps: ["nodes", "ports"],
    },
    signals: {
        create: useSignalService,
    },
    snapshot: {
        create: useSnapshotService,
    },
};

export const buildGraphServices = (graph: Graph, ctx: UIEngineContext): GraphRuntimeServices => {
    const runtimeDefinitions = Object.fromEntries(
        (Object.keys(serviceDefinitions) as GraphRuntimeServiceName[]).map((name) => [
            name,
            {
                create: () => serviceDefinitions[name].create(graph, ctx),
                createDeps: serviceDefinitions[name].createDeps,
                runtimeDeps: serviceDefinitions[name].runtimeDeps,
            },
        ]),
    ) as ServiceDefinitionMap<GraphRuntimeServiceName, GraphRuntimeServices>;

    const { services } = buildContextServiceRegistry<GraphRuntimeServiceName, GraphRuntimeServices>(
        runtimeDefinitions,
        {
            label: "graph service",
            ctx,
        },
    );

    return services;
};

