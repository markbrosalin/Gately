import { createErrResult, createOkResult } from "@engine-model/core/result";
import type { UIEngineUseCaseDeps, UIEngineUseCaseInternals } from "../types";

type CreateActivateWorkspaceSceneUseCaseDeps = Pick<
    UIEngineUseCaseDeps,
    "getContainer" | "graphDocument" | "graphRenderer"
> & {
    syncRendererReady: UIEngineUseCaseInternals["syncRendererReady"];
};

export const createActivateWorkspaceScene = ({
    getContainer,
    graphDocument,
    graphRenderer,
    syncRendererReady,
}: CreateActivateWorkspaceSceneUseCaseDeps): UIEngineUseCaseInternals["activateWorkspaceScene"] => {
    return (workspaceId) => {
        const ensureResult = graphDocument.ensureDocument({ workspaceId });
        if (!ensureResult.ok || !ensureResult.value) {
            return createErrResult(ensureResult.issues);
        }

        const container = getContainer();
        if (!container) {
            syncRendererReady();
            return createOkResult(ensureResult.value);
        }

        const shouldReopenRenderer =
            !graphRenderer.query.isOpen() ||
            graphRenderer.query.activeWorkspaceId() !== workspaceId ||
            graphRenderer.query.container() !== container;

        if (shouldReopenRenderer) {
            const closeResult = graphRenderer.close();
            if (!closeResult.ok) {
                return createErrResult(closeResult.issues);
            }

            const openResult = graphRenderer.open({
                workspaceId,
                container,
            });
            if (!openResult.ok) {
                return createErrResult(openResult.issues);
            }
        }

        const loadResult = graphRenderer.loadDocument({
            document: ensureResult.value,
        });
        if (!loadResult.ok || !loadResult.value) {
            return createErrResult(loadResult.issues);
        }

        syncRendererReady();
        return createOkResult(loadResult.value);
    };
};
