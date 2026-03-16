import { createOkResult, type Result } from "@engine-model/core/result";
import type { UseCase } from "@engine-model/core/use-case";
import type { GraphRendererUseCaseDeps } from "./types";

type GraphRendererUnmountResult = Result;

export type GraphRendererUnmountUseCase = UseCase<void, GraphRendererUnmountResult>;

export const createUnmountUseCase = ({
    instance,
}: Pick<GraphRendererUseCaseDeps, "instance">): GraphRendererUnmountUseCase => {
    return () => {
        instance.unmount();
        return createOkResult();
    };
};


