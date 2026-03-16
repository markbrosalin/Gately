import {
    createErrResult,
    createOkResult,
    type Result,
} from "@engine-model/core/result";
import type { UseCase } from "@engine-model/core/use-case";
import type { GraphDocument } from "@engine-model/graph-document";
import { parseGraphRendererDocumentContentJson } from "../services/document";
import { graphRendererUseCaseIssues } from "./issues";
import type { GraphRendererUseCaseDeps } from "./types";

type GraphRendererLoadDocumentInput = {
    document: GraphDocument;
};

type GraphRendererLoadDocumentResult = Result<GraphDocument>;

export type GraphRendererLoadDocumentUseCase = UseCase<
    GraphRendererLoadDocumentInput,
    GraphRendererLoadDocumentResult
>;

export const createLoadDocumentUseCase = ({
    document,
    query,
}: Pick<GraphRendererUseCaseDeps, "document" | "query">): GraphRendererLoadDocumentUseCase => {
    return ({ document: nextDocument }) => {
        if (!query.isMounted()) {
            return createErrResult(graphRendererUseCaseIssues.rendererNotOpen([]));
        }

        const parsedContent = parseGraphRendererDocumentContentJson(nextDocument.contentJson);
        if (!parsedContent.ok) {
            return createErrResult(
                graphRendererUseCaseIssues.documentContentJsonInvalid(["document", "contentJson"]),
            );
        }

        document.loadDocument({
            document: nextDocument,
            contentJson: parsedContent.value,
        });

        return createOkResult(nextDocument);
    };
};


