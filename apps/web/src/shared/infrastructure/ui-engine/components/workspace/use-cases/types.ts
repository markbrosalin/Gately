import type { UIEngineExternalContext, WorkspaceTabDocument } from "engine-model";
import type {
    WorkspaceFactoryService,
    WorkspaceQueryService,
    WorkspaceStateService,
} from "../services";
import type { WorkspaceCloseTabUseCase } from "./closeTab";
import type { WorkspaceCreateTabUseCase } from "./createTab";
import type { WorkspaceExportTabUseCase } from "./exportTab";
import type { WorkspaceImportTabUseCase } from "./importTab";
import type { WorkspaceOpenUseCase } from "./open";
import type { WorkspaceUpdateTitleUseCase } from "./updateTitle";

export type WorkspaceUseCaseDeps = {
    external: UIEngineExternalContext;
    factory: Pick<WorkspaceFactoryService, "createTabSession" | "createTabWorkspace">;
    query: WorkspaceQueryService;
    state: WorkspaceStateService;
};

export type WorkspaceUseCases = {
    createTab: WorkspaceCreateTabUseCase;
    open: WorkspaceOpenUseCase;
    closeTab: WorkspaceCloseTabUseCase;
    exportTab: WorkspaceExportTabUseCase;
    importTab: WorkspaceImportTabUseCase;
    updateTitle: WorkspaceUpdateTitleUseCase;
};

export type { WorkspaceTabDocument };
