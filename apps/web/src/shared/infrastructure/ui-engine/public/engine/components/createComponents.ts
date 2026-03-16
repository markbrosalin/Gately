import {
    createCatalog,
    createGraphDocument,
    createGraphRenderer,
    createWorkspace,
} from "@engine-components";
import { createComponentRegistry } from "../../../lib/registry";
import { UIEngineContext } from "@engine-model";

export type EngineComponents = ReturnType<typeof buildComponents>;

export const buildComponents = (ctx: UIEngineContext) => {
    const componentRegistry = createComponentRegistry(ctx);
    const catalog = componentRegistry.register("catalog", createCatalog);
    const workspace = componentRegistry.register("workspace", createWorkspace);
    const graphDocument = componentRegistry.register("graph-document", createGraphDocument);
    const graphRenderer = componentRegistry.register("graph-renderer", createGraphRenderer);

    return { catalog, workspace, graphDocument, graphRenderer } as const;
};
