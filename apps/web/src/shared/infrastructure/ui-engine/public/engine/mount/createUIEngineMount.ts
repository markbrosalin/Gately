import type { UIEngineMountApi } from "../../types";
import type { UIEngineUseCaseInternals } from "../use-cases";

type CreateUIEngineMountDeps = {
    setContainerState: (container?: HTMLDivElement) => void;
    getActiveWorkspaceId: () => string | undefined;
    graphRendererClose: () => { ok: boolean; issues: Array<{ message: string }> };
    reportIssues: (label: string, issues: Array<{ message: string }>) => void;
} & Pick<
    UIEngineUseCaseInternals,
    "activateWorkspaceScene" | "persistActiveGraphDocument" | "syncRendererReady"
>;

export const createUIEngineMount = ({
    setContainerState,
    getActiveWorkspaceId,
    graphRendererClose,
    reportIssues,
    activateWorkspaceScene,
    persistActiveGraphDocument,
    syncRendererReady,
}: CreateUIEngineMountDeps): UIEngineMountApi => {
    return {
        setContainer(container) {
            if (!container) {
                const persistResult = persistActiveGraphDocument();
                if (!persistResult.ok) {
                    reportIssues("persist-active-graph-document", persistResult.issues);
                }

                const closeResult = graphRendererClose();
                if (!closeResult.ok) {
                    reportIssues("close-graph-renderer", closeResult.issues);
                }

                setContainerState(undefined);
                syncRendererReady();
                return;
            }

            setContainerState(container);
            const activeWorkspaceId = getActiveWorkspaceId();
            if (!activeWorkspaceId) {
                syncRendererReady();
                return;
            }

            const activateResult = activateWorkspaceScene(activeWorkspaceId);
            if (!activateResult.ok) {
                reportIssues("activate-workspace-scene", activateResult.issues);
            }
        },
    };
};
