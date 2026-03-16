import { createErrResult, createOkResult } from "@engine-model/core/result";
import type { UIEngineUseCaseDeps, UIEngineUseCaseInternals } from "../types";

type CreateActivateWorkspaceSceneUseCaseDeps = Pick<
    UIEngineUseCaseDeps,
    "graphDocument" | "graphRenderer"
>;

export const createActivateWorkspaceScene = ({
    graphDocument,
    graphRenderer,
}: CreateActivateWorkspaceSceneUseCaseDeps): UIEngineUseCaseInternals["activateWorkspaceScene"] => {
    return (workspaceId) => {
        const ensureResult = graphDocument.ensureDocument({ workspaceId });
        if (!ensureResult.ok || !ensureResult.value) {
            return createErrResult(ensureResult.issues);
        }

        if (!graphRenderer.query.isMounted()) {
            return createOkResult(ensureResult.value);
        }

        const loadResult = graphRenderer.loadDocument({
            document: ensureResult.value,
        });
        if (!loadResult.ok || !loadResult.value) {
            return createErrResult(loadResult.issues);
        }

        return createOkResult(loadResult.value);
    };
};
