import { ComponentDeps } from "@engine-model/core/context";
import type { WorkspaceQueryService } from "./services";
import type { WorkspaceCloseTabUseCase } from "./use-cases/closeTab";
import type { WorkspaceCreateTabUseCase } from "./use-cases/createTab";
import type { WorkspaceExportTabUseCase } from "./use-cases/exportTab";
import type { WorkspaceImportTabUseCase } from "./use-cases/importTab";
import type { WorkspaceOpenUseCase } from "./use-cases/open";
import type { WorkspaceUpdateTitleUseCase } from "./use-cases/updateTitle";
import type { WorkspaceExternal } from "./external";

export type WorkspaceDeps = ComponentDeps<WorkspaceExternal>;

export type WorkspaceApi = {
    query: WorkspaceQueryService;
    createTab: WorkspaceCreateTabUseCase;
    open: WorkspaceOpenUseCase;
    closeTab: WorkspaceCloseTabUseCase;
    exportTab: WorkspaceExportTabUseCase;
    importTab: WorkspaceImportTabUseCase;
    updateTitle: WorkspaceUpdateTitleUseCase;
};


