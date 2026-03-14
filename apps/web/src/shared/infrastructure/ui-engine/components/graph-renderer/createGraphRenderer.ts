import { createUninitializedGetter } from "@gately/shared/infrastructure/ui-engine/lib/registry";
import { buildGraphRendererServices } from "./services";
import { buildGraphRendererUseCases } from "./use-cases";
import type { GraphRendererApi, GraphRendererDeps } from "./types";

export const createGraphRenderer = (deps: GraphRendererDeps) => {
    const services = buildGraphRendererServices({
        ...deps,
        getService: createUninitializedGetter("GraphRenderer"),
    });
    const useCases = buildGraphRendererUseCases(services);

    return {
        query: services.query,
        open: useCases.open,
        close: useCases.close,
        createNode: useCases.createNode,
        removeSelection: useCases.removeSelection,
        removeNode: useCases.removeNode,
        removeEdge: useCases.removeEdge,
        loadDocument: useCases.loadDocument,
        exportDocument: useCases.exportDocument,
    } satisfies GraphRendererApi;
};

