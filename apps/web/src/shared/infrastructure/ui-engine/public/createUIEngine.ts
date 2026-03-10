import { createGraphRuntimeHost } from "../components/graph-runtime";
import { createWorkspace } from "../components/workspace";
import { createComponentRegistry, createUninitializedGetter } from "../lib/registry";
import { buildSharedServices } from "../shared-services";
import type { UIEngineContext, UIEngineExternalContext } from "../model";
import type { UIEngineInstance } from "./types";
import { createUIEngineCommands } from "./createUIEngineCommands";
import { createUIEngineHooks } from "./createUIEngineHooks";
import { createUIEngineState } from "./createUIEngineState";

export const createUIEngine = (externalCtx: UIEngineExternalContext = {}): UIEngineInstance => {
    const hooks = createUIEngineHooks(externalCtx.hooks);
    const { getService: getSharedService } = buildSharedServices(externalCtx.hooks);
    const engineCtx: UIEngineContext = {
        external: externalCtx,
        getSharedService,
        getService: createUninitializedGetter("[UIEngine] graph service getter is not initialized"),
    };
    const componentRegistry = createComponentRegistry(engineCtx);
    const workspaceComponent = componentRegistry.register("workspace", createWorkspace);
    const graphRuntimeHost = componentRegistry.register(
        "graph-runtime",
        () =>
            createGraphRuntimeHost({
                ctx: engineCtx,
                emitLifecycle: hooks.emitLifecycle,
                reportError: hooks.reportError,
                onAttached: () => {
                    workspaceComponent.syncRuntimeSnapshot();
                },
            }),
    );
    const commands = createUIEngineCommands({
        ctx: engineCtx,
        workspace: workspaceComponent,
        graphRuntimeHost,
        reportError: hooks.reportError,
    });
    const state = createUIEngineState({
        workspace: workspaceComponent,
        graphRuntimeHost,
    });

    return {
        mount: graphRuntimeHost.mount,
        state,
        commands,
        debug: {
            graph: graphRuntimeHost.graph,
        },
        dispose: graphRuntimeHost.dispose,
    };
};


