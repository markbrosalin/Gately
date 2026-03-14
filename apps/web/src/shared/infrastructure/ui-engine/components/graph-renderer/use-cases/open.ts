import type { Graph } from "@antv/x6";
import { createOkResult, type Result } from "@engine-model/core/result";
import type { UseCase } from "@engine-model/core/use-case";
import type { GraphRendererInstanceOpenInput } from "../services/instance";
import type { GraphRendererUseCaseDeps } from "./types";

type GraphRendererOpenResult = Result<Graph>;

export type GraphRendererOpenUseCase = UseCase<
    GraphRendererInstanceOpenInput,
    GraphRendererOpenResult
>;

export const createOpenUseCase = ({
    instance,
    layouts,
    selection,
}: Pick<
    GraphRendererUseCaseDeps,
    "instance" | "layouts" | "selection"
>): GraphRendererOpenUseCase => {
    return (input) => {
        layouts.registerPortLayouts();
        const graph = instance.open(input);
        selection.install();
        return createOkResult(graph);
    };
};


