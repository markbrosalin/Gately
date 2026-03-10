import { createOkResult, type Result, type UseCase } from "@engine-model";
import type { GraphRendererUseCaseDeps } from "./types";

type GraphRendererCloseResult = Result;

export type GraphRendererCloseUseCase = UseCase<void, GraphRendererCloseResult>;

export const createCloseUseCase = ({
    instance,
}: Pick<GraphRendererUseCaseDeps, "instance">): GraphRendererCloseUseCase => {
    return () => {
        instance.close();
        return createOkResult();
    };
};


