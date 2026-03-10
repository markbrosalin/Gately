import type { ItemBuilderResult } from "@cnbn/engine";
import { getNodeKindByHash } from "../model";
import type { UIEngineContext, UIEngineErrorEvent } from "../model";
import type { createGraphRuntimeHost } from "../components/graph-runtime";
import type { createWorkspace } from "../components/workspace";
import type { UIEnginePublicApi } from "./types";

type CreateUIEngineCommandsDeps = {
    ctx: UIEngineContext;
    workspace: ReturnType<typeof createWorkspace>;
    graphRuntimeHost: ReturnType<typeof createGraphRuntimeHost>;
    reportError: (event: UIEngineErrorEvent) => void;
};

export const createUIEngineCommands = ({
    ctx,
    workspace,
    graphRuntimeHost,
    reportError,
}: CreateUIEngineCommandsDeps): UIEnginePublicApi["commands"] => {
    const getRequiredLogicEngine = () => {
        const logicEngine = ctx.external.logicEngine;
        if (!logicEngine) {
            const error = new Error("[UIEngine] logic engine is not configured");
            reportError({
                label: "component",
                name: "ui-engine",
                stage: "runtime",
                error,
            });
            throw error;
        }

        return logicEngine;
    };

    return {
        createTab(input) {
            return workspace.createTab(input);
        },
        openTab(tabId) {
            workspace.openTab(tabId);
        },
        openScope(scopeId, tabId) {
            workspace.openScope(scopeId, tabId);
        },
        canCloseTab(tabId, conditions) {
            return workspace.canCloseTab(tabId, conditions);
        },
        closeTab(tabId, conditions) {
            return workspace.closeTab(tabId, conditions);
        },
        async addNode(input) {
            const logicEngine = getRequiredLogicEngine();
            const runtime = graphRuntimeHost.requireRuntime();
            const activeScopeId = workspace.query.activeScopeId();
            if (!activeScopeId) return;

            const activeScope = workspace.query.getScope(activeScopeId);
            if (!activeScope) return;

            const result = (await logicEngine.call("/item/create", {
                kind: getNodeKindByHash(input.hash),
                hash: input.hash,
                path: [...activeScope.path, activeScope.id],
            })) as ItemBuilderResult;
            console.log(result);
            return runtime.createBuiltNode(result);
        },
        exportScopeSnapshot() {
            const activeScopeId = workspace.query.activeScopeId();
            const activeScope = activeScopeId ? workspace.query.getScope(activeScopeId) : undefined;
            const snapshot = ctx.getSharedService("snapshotHub").exportScopeSnapshot();

            if (snapshot?.contentJson !== undefined && snapshot.viewport) {
                return {
                    contentJson: snapshot.contentJson,
                    viewport: snapshot.viewport,
                    extensions: snapshot.extensions,
                };
            }

            return {
                contentJson: activeScope?.contentJson ?? "",
                viewport: activeScope?.viewport ?? { zoom: 1, tx: 0, ty: 0 },
                extensions: activeScope?.extensions,
            };
        },
        importScopeSnapshot(snapshot) {
            ctx.getSharedService("snapshotHub").importScopeSnapshot(snapshot);
        },
        applyPinPatch(patch) {
            graphRuntimeHost.requireRuntime().applyPinPatch(patch);
        },
        applySignalEvents(events) {
            graphRuntimeHost.requireRuntime().applySignalEvents(events);
        },
    };
};

