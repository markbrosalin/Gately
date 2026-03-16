import { createOkResult, type Result } from "@engine-model/core/result";
import type { UseCase } from "@engine-model/core/use-case";
import type { GraphRendererUseCaseDeps } from "./types";

type GraphRendererClearSceneResult = Result;

export type GraphRendererClearSceneUseCase = UseCase<void, GraphRendererClearSceneResult>;

export const createClearSceneUseCase = ({
    document,
    query,
}: Pick<GraphRendererUseCaseDeps, "document" | "query">): GraphRendererClearSceneUseCase => {
    return () => {
        query.graph()?.clearCells?.();
        document.clearActiveWorkspaceId();
        return createOkResult();
    };
};
