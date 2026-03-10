import { createOkResult, type Result } from "@engine-model/core/result";
import type { UseCase } from "@engine-model/core/use-case";
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


