import { createUninitializedGetter } from "@gately/shared/infrastructure/ui-engine/lib/registry";
import { buildGraphDocumentServices } from "./services";
import { buildGraphDocumentUseCases } from "./use-cases";
import type { GraphDocumentApi, GraphDocumentDeps } from "./types";

export const createGraphDocument = (deps: GraphDocumentDeps) => {
    const services = buildGraphDocumentServices({
        ...deps,
        getService: createUninitializedGetter("GraphDocument"),
    });
    const useCases = buildGraphDocumentUseCases(services);

    return {
        query: services.query,
        ensureDocument: useCases.ensureDocument,
        saveDocument: useCases.saveDocument,
        removeDocument: useCases.removeDocument,
        importDocument: useCases.importDocument,
        exportDocument: useCases.exportDocument,
    } satisfies GraphDocumentApi;
};

