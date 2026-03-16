import type { Graph } from "@antv/x6";
import { createOkResult, type Result } from "@engine-model/core/result";
import type { UseCase } from "@engine-model/core/use-case";
import type { GraphRendererInstanceMountInput } from "../services/instance";
import type { GraphRendererUseCaseDeps } from "./types";

type GraphRendererMountResult = Result<Graph>;

export type GraphRendererMountUseCase = UseCase<
    GraphRendererInstanceMountInput,
    GraphRendererMountResult
>;

export const createMountUseCase = ({
    instance,
    layouts,
    selection,
}: Pick<
    GraphRendererUseCaseDeps,
    "instance" | "layouts" | "selection"
>): GraphRendererMountUseCase => {
    return (input) => {
        layouts.registerPortLayouts();
        const graph = instance.mount(input);
        selection.install();
        return createOkResult(graph);
    };
};


