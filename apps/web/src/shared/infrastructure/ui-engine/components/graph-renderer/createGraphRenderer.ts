import { createUninitializedGetter } from "@gately/shared/infrastructure/ui-engine/lib/registry";
import { buildGraphRendererPlugins } from "./plugins";
import { buildGraphRendererServices, GraphRendererServiceContext } from "./services";
import { buildGraphRendererUseCases } from "./use-cases";
import type { GraphRendererApi, GraphRendererDeps } from "./types";

export const createGraphRenderer = (deps: GraphRendererDeps) => {
    const ctx = {
        ...deps,
        getService: createUninitializedGetter("GraphRenderer"),
    } as GraphRendererServiceContext;

    const services = buildGraphRendererServices(ctx);
    buildGraphRendererPlugins(ctx);
    const useCases = buildGraphRendererUseCases(services);

    return {
        query: services.query,
        lifecycle: {
            onGraphMount: services.instance.onGraphMount,
            onGraphUnmount: services.instance.onGraphUnmount,
        },
        mount: useCases.mount,
        unmount: useCases.unmount,
        clearScene: useCases.clearScene,
        createNode: useCases.createNode,
        removeSelection: useCases.removeSelection,
        removeNode: useCases.removeNode,
        removeEdge: useCases.removeEdge,
        loadDocument: useCases.loadDocument,
        exportDocument: useCases.exportDocument,
    } satisfies GraphRendererApi;
};
