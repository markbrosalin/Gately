import type { Graph } from "@antv/x6";
import type { UseCase, Result } from "../../../model";
import { createOkResult } from "../../../model";
import type { GraphRendererInstanceOpenInput } from "../services/instance";
import type { GraphRendererUseCaseDeps } from "./types";

type GraphRendererOpenResult = Result<Graph>;

export type GraphRendererOpenUseCase = UseCase<
    GraphRendererInstanceOpenInput,
    GraphRendererOpenResult
>;

export const createOpenUseCase = ({
    instance,
}: Pick<GraphRendererUseCaseDeps, "instance">): GraphRendererOpenUseCase => {
    return (input) => createOkResult(instance.open(input));
};
