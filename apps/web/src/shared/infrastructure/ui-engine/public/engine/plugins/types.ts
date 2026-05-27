import type { Plugin } from "@engine-model/core/plugin";
import type { EngineComponents } from "../components/createComponents";
import type { EngineUseCasesPublic } from "../use-cases/types";

export type EnginePluginContext = {
    components: EngineComponents;
    useCases: EngineUseCasesPublic;
};

export type EnginePlugin = Plugin<EnginePluginContext>;
