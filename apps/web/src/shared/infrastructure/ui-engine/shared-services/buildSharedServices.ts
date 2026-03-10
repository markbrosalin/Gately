import { buildServiceRegistry } from "../lib/registry/buildServiceRegistry";
import type { ServiceDefinitionMap, UIEngineHooks } from "../model/core";
import { createEventBus, type EventBusServiceContract } from "./event-bus";
import { createSnapshotHub, type SnapshotHubServiceContract } from "./snapshot-hub";

export type SharedServices = {
    eventBus: EventBusServiceContract;
    snapshotHub: SnapshotHubServiceContract;
};

export type SharedServiceName = keyof SharedServices;

export type SharedServiceGetter = <K extends SharedServiceName>(name: K) => SharedServices[K];

const createSharedServiceDefinitions = (
    hooks?: UIEngineHooks,
): ServiceDefinitionMap<SharedServiceName, SharedServices> => ({
    eventBus: {
        create: () => createEventBus(hooks),
    },
    snapshotHub: {
        create: () => createSnapshotHub(hooks),
    },
});

export const buildSharedServices = (hooks?: UIEngineHooks) => {
    return buildServiceRegistry<SharedServiceName, SharedServices>(
        createSharedServiceDefinitions(hooks),
        {
            label: "shared service",
            onLifecycle: hooks?.onLifecycle,
            onError: hooks?.onError,
        },
    );
};

