import { buildWorkspaceServices } from "./services";
import { buildWorkspaceUseCases } from "./use-cases";
import type { WorkspaceApi, WorkspaceDeps } from "./types";
import { createUninitializedGetter } from "../../lib/registry";

export const createWorkspace = (deps: WorkspaceDeps) => {
    const services = buildWorkspaceServices({
        ...deps,
        getService: createUninitializedGetter("Workspace"),
    });

    const useCases = buildWorkspaceUseCases({
        external: deps.external,
        ...services,
    });

    return {
        query: services.query,
        createTab: useCases.createTab,
        open: useCases.open,
        closeTab: useCases.closeTab,
        exportTab: useCases.exportTab,
        importTab: useCases.importTab,
        updateTitle: useCases.updateTitle,
    } satisfies WorkspaceApi;
};

