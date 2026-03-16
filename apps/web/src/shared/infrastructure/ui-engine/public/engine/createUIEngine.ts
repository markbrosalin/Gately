import { createUninitializedGetter } from "../../lib/registry";
import type { UIEngineContext, UIEngineExternalContext } from "../../model/core";
import { buildSharedServices } from "../../shared-services";
import type { EnginePublicApi } from "../types";
import { buildEngineMount } from "./mount/buildEngineMount";
import { buildQueryApi } from "./query/createUIEngineQuery";
import { buildEngineUseCases } from "./use-cases";
import { buildComponents } from "./components/createComponents";

export const createUIEngine = (externalCtx: UIEngineExternalContext = {}): EnginePublicApi => {
    const { getService: getSharedService } = buildSharedServices(externalCtx.hooks);

    const engineCtx: UIEngineContext = {
        external: externalCtx,
        getSharedService,
        getService: createUninitializedGetter("[UIEngine] graph service getter is not initialized"),
    };

    const components = buildComponents(engineCtx);
    const query = buildQueryApi(components);
    const useCases = buildEngineUseCases(components);

    const mount = buildEngineMount({ components, useCases });

    return {
        mount,
        query,
        api: useCases.public,
    };
};

// const stdLibraryResult = catalog.importLibrary({
//     library: buildStdLibrary(),
//     strategy: "replace",
// });
// if (!stdLibraryResult.ok) {
//     const error = createIssuesError("import-std-library", stdLibraryResult.issues);
//     hooks.reportError({
//         label: "component",
//         name: "ui-engine",
//         stage: "create",
//         error,
//     });
//     throw error;
// }
