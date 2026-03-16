import { createErrResult, createOkResult } from "@engine-model/core/result";
import type { GraphDocument } from "@engine-model/graph-document";
import type {
    PersistActiveGraphDocumentResult,
    UIEngineUseCaseInternals,
    UIEngineUseCaseDeps,
} from "../types";

type CreatePersistActiveGraphDocumentUseCaseDeps = Pick<
    UIEngineUseCaseDeps,
    "graphDocument" | "graphRenderer" | "workspace"
>;

export const createPersistActiveGraphDocument = ({
    graphDocument,
    graphRenderer,
    workspace,
}: CreatePersistActiveGraphDocumentUseCaseDeps): UIEngineUseCaseInternals["persistActiveGraphDocument"] => {
    return (): PersistActiveGraphDocumentResult => {
        const activeWorkspaceId = workspace.query.activeWorkspaceId();
        if (!graphRenderer.query.isMounted() || !activeWorkspaceId) {
            return createOkResult<GraphDocument | undefined>(undefined);
        }

        const exportResult = graphRenderer.exportDocument();
        if (!exportResult.ok || !exportResult.value) {
            return createErrResult(exportResult.issues);
        }

        const document = exportResult.value;
        return graphDocument.saveDocument({
            workspaceId: document.workspaceId,
            contentJson: document.contentJson,
            viewport: document.viewport,
            extensions: document.extensions ?? {},
        });
    };
};
