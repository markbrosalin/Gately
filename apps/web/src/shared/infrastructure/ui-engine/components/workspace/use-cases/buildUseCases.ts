import { createCloseTabUseCase } from "./closeTab";
import { createCreateTabUseCase } from "./createTab";
import { createExportTabUseCase } from "./exportTab";
import { createImportTabUseCase } from "./importTab";
import { createOpenUseCase } from "./open";
import { createUpdateTitleUseCase } from "./updateTitle";
import type { WorkspaceUseCaseDeps, WorkspaceUseCases } from "./types";

export const buildWorkspaceUseCases = (deps: WorkspaceUseCaseDeps): WorkspaceUseCases => {
    return {
        createTab: createCreateTabUseCase(deps),
        open: createOpenUseCase(deps),
        closeTab: createCloseTabUseCase(deps),
        exportTab: createExportTabUseCase(deps),
        importTab: createImportTabUseCase(deps),
        updateTitle: createUpdateTitleUseCase(deps),
    };
};

