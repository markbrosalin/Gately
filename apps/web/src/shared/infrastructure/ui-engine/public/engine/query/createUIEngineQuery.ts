import type { CatalogApi } from "../../../components/catalog/types";
import type { GraphDocumentApi } from "../../../components/graph-document/types";
import type { GraphRendererApi } from "../../../components/graph-renderer/types";
import type { WorkspaceApi } from "../../../components/workspace/types";
import type { UIEngineQueryApi } from "../../types";

type CreateUIEngineQueryDeps = {
    catalog: CatalogApi;
    workspace: WorkspaceApi;
    graphDocument: GraphDocumentApi;
    graphRenderer: GraphRendererApi;
    isMounted: () => boolean;
    isReady: () => boolean;
};

export const createUIEngineQuery = ({
    catalog,
    workspace,
    graphDocument,
    graphRenderer,
    isMounted,
    isReady,
}: CreateUIEngineQueryDeps): UIEngineQueryApi => {
    return {
        engine: {
            isMounted,
            isReady,
        },
        catalog: catalog.query,
        workspace: workspace.query,
        graphDocument: graphDocument.query,
        graphRenderer: graphRenderer.query,
    };
};
