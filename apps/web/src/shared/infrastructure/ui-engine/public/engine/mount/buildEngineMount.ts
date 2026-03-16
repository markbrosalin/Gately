import { EngineComponents } from "../components/createComponents";
import { EngineUseCases } from "../use-cases/types";

export type EngineMountApi = (container?: HTMLDivElement) => void;

type EngineMountDeps = {
    components: EngineComponents;
    useCases: EngineUseCases;
};

export const buildEngineMount = (deps: EngineMountDeps): EngineMountApi => {
    return (container) => {
        if (!container) return;

        const graphRendererIsMounted = deps.components.graphRenderer.query.isMounted;
        const graphRendererContainer = deps.components.graphRenderer.query.container;
        const graphRendererMount = deps.components.graphRenderer.mount;

        const shouldMount = !graphRendererIsMounted() || graphRendererContainer() !== container;

        if (shouldMount) {
            const mountResult = graphRendererMount({ container });
            if (!mountResult.ok) {
                return;
            }
        }
    };
};
