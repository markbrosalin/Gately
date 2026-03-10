import type { Graph } from "@antv/x6";
import { createOkResult, type Result, type UseCase } from "@engine-model";
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
}: Pick<GraphRendererUseCaseDeps, "instance" | "layouts">): GraphRendererOpenUseCase => {
    return (input) => {
        layouts.registerPortLayouts();
        return createOkResult(instance.open(input));
    };
};


