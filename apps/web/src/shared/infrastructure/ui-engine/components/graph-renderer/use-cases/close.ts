import type { UseCase, Result } from "../../../model";
import { createOkResult } from "../../../model";
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
