import { buildContextServiceRegistry } from "@gately/shared/infrastructure/ui-engine/lib/registry";
import { createWorkspaceFactoryService } from "./factory";
import { createWorkspaceQueryService } from "./query";
import { createWorkspaceStateService } from "./state";
import type { WorkspaceServiceContext, WorkspaceServiceName, WorkspaceServices } from "./types";
import { ServiceDefinitionMap } from "engine-model/core/context";

type WorkspaceServiceDefinitions = ServiceDefinitionMap<WorkspaceServiceName, WorkspaceServices>;

const createServiceDefinitions = (ctx: WorkspaceServiceContext): WorkspaceServiceDefinitions => ({
    state: {
        create: () => createWorkspaceStateService(),
    },
    factory: {
        create: () => createWorkspaceFactoryService(),
    },
    query: {
        create: () => createWorkspaceQueryService(ctx),
        createDeps: ["state"],
    },
});

export const buildWorkspaceServices = (ctx: WorkspaceServiceContext): WorkspaceServices => {
    const definitions = createServiceDefinitions(ctx);
    const { services } = buildContextServiceRegistry<WorkspaceServiceName, WorkspaceServices>(
        definitions,
        {
            label: "workspace service",
            ctx,
        },
    );

    return services;
};
