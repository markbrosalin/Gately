import type { UIEngineMountApi } from "../../types";
import type { UIEngineUseCaseInternals } from "../use-cases";

type CreateUIEngineMountDeps = {
    getActiveWorkspaceId: () => string | undefined;
    graphRendererMount: (input: {
        container: HTMLDivElement;
    }) => { ok: boolean; issues: Array<{ message: string }> };
    graphRendererUnmount: () => { ok: boolean; issues: Array<{ message: string }> };
    graphRendererContainer: () => HTMLDivElement | undefined;
    graphRendererIsMounted: () => boolean;
    reportIssues: (label: string, issues: Array<{ message: string }>) => void;
} & Pick<UIEngineUseCaseInternals, "activateWorkspaceScene" | "persistActiveGraphDocument">;

export const createUIEngineMount = ({
    getActiveWorkspaceId,
    graphRendererMount,
    graphRendererUnmount,
    graphRendererContainer,
    graphRendererIsMounted,
    reportIssues,
    activateWorkspaceScene,
    persistActiveGraphDocument,
}: CreateUIEngineMountDeps): UIEngineMountApi => {
    return {
        setContainer(container) {
            if (!container) {
                const persistResult = persistActiveGraphDocument();
                if (!persistResult.ok) {
                    reportIssues("persist-active-graph-document", persistResult.issues);
                }

                if (graphRendererIsMounted()) {
                    const unmountResult = graphRendererUnmount();
                    if (!unmountResult.ok) {
                        reportIssues("unmount-graph-renderer", unmountResult.issues);
                    }
                }

                return;
            }

            const shouldRemount =
                !graphRendererIsMounted() || graphRendererContainer() !== container;

            if (shouldRemount) {
                const mountResult = graphRendererMount({ container });
                if (!mountResult.ok) {
                    reportIssues("mount-graph-renderer", mountResult.issues);
                    return;
                }
            }

            const activeWorkspaceId = getActiveWorkspaceId();
            if (!activeWorkspaceId) {
                return;
            }

            const activateResult = activateWorkspaceScene(activeWorkspaceId);
            if (!activateResult.ok) {
                reportIssues("activate-workspace-scene", activateResult.issues);
            }
        },
    };
};
