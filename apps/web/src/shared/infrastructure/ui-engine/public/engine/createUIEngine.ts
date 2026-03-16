import { createCatalog } from "../../components/catalog";
import { createGraphDocument } from "../../components/graph-document";
import { createGraphRenderer } from "../../components/graph-renderer";
import { createWorkspace } from "../../components/workspace";
import { createComponentRegistry, createUninitializedGetter } from "../../lib/registry";
import type { UIEngineContext, UIEngineExternalContext } from "../../model/core";
import { buildStdLibrary } from "../../presets";
import { buildSharedServices } from "../../shared-services";
import { createEngineHooks } from "./use-cases/helpers/createEngineHooks";
import type { UIEngineInstance } from "../types";
import { createUIEngineMount } from "./mount/createUIEngineMount";
import { createUIEngineQuery } from "./query/createUIEngineQuery";
import { buildUIEngineUseCases } from "./use-cases";

const createIssuesError = (label: string, issues: Array<{ message: string }>): Error => {
    const message = issues.map((issue) => issue.message).join("; ") || label;
    return new Error(`[UIEngine] ${label}: ${message}`);
};

export const createUIEngine = (externalCtx: UIEngineExternalContext = {}): UIEngineInstance => {
    const hooks = createEngineHooks(externalCtx.hooks);

    const { getService: getSharedService } = buildSharedServices(externalCtx.hooks);
    const engineCtx: UIEngineContext = {
        external: externalCtx,
        getSharedService,
        getService: createUninitializedGetter("[UIEngine] graph service getter is not initialized"),
    };

    const componentRegistry = createComponentRegistry(engineCtx);
    const catalog = componentRegistry.register("catalog", createCatalog);
    const workspace = componentRegistry.register("workspace", createWorkspace);
    const graphDocument = componentRegistry.register("graph-document", createGraphDocument);
    const graphRenderer = componentRegistry.register("graph-renderer", createGraphRenderer);

    const stdLibraryResult = catalog.importLibrary({
        library: buildStdLibrary(),
        strategy: "replace",
    });
    if (!stdLibraryResult.ok) {
        const error = createIssuesError("import-std-library", stdLibraryResult.issues);
        hooks.reportError({
            label: "component",
            name: "ui-engine",
            stage: "create",
            error,
        });
        throw error;
    }

    const query = createUIEngineQuery({
        catalog,
        workspace,
        graphDocument,
        graphRenderer,
        isMounted: graphRenderer.query.isMounted,
        isReady: graphRenderer.query.isMounted,
    });

    const { useCases, internals } = buildUIEngineUseCases({
        catalog,
        workspace,
        graphDocument,
        graphRenderer,
    });

    const reportIssues = (label: string, issues: Array<{ message: string }>) => {
        hooks.reportError({
            label: "component",
            name: "ui-engine",
            stage: "runtime",
            error: createIssuesError(label, issues),
        });
    };

    const mount = createUIEngineMount({
        getActiveWorkspaceId: workspace.query.activeWorkspaceId,
        graphRendererMount: graphRenderer.mount,
        graphRendererUnmount: graphRenderer.unmount,
        graphRendererContainer: graphRenderer.query.container,
        graphRendererIsMounted: graphRenderer.query.isMounted,
        reportIssues,
        ...internals,
    });

    const dispose = () => {
        const persistResult = internals.persistActiveGraphDocument();
        if (!persistResult.ok) {
            reportIssues("dispose.persist-active-graph-document", persistResult.issues);
        }

        if (graphRenderer.query.isMounted()) {
            const unmountResult = graphRenderer.unmount();
            if (!unmountResult.ok) {
                reportIssues("dispose.unmount-graph-renderer", unmountResult.issues);
            }
        }
    };

    return {
        mount,
        query,
        useCases,
        debug: {
            graph: graphRenderer.query.graph,
        },
        dispose,
    };
};
