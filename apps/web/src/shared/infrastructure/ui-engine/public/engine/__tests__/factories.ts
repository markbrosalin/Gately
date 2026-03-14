/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Node } from "@antv/x6";
import type { CatalogItem } from "@engine-model/catalog";
import { createOkResult } from "@engine-model/core/result";
import type { Issue } from "@engine-model/core/issue";
import {
    GRAPH_DOCUMENT_FORMAT_VERSION,
    type GraphDocument,
    type GraphDocumentViewport,
} from "@engine-model/graph-document";
import type { Workspace, WorkspaceTabSession } from "@engine-model/workspace";
import { BUFFER_LOGIC_ITEM } from "@engine-presets/std-library/logic/logic/buffer";
import { vi } from "vitest";
import type { CatalogApi } from "../../../components/catalog/types";
import type { GraphDocumentApi } from "../../../components/graph-document/types";
import type { GraphRendererApi } from "../../../components/graph-renderer/types";
import type { WorkspaceApi } from "../../../components/workspace/types";
import type { UIEngineUseCaseDeps, UIEngineUseCaseInternals } from "../use-cases";

export const createTestContainer = (): HTMLDivElement => ({}) as HTMLDivElement;

export const createTestIssue = (message = "test issue"): Issue =>
    ({
        code: "ui-engine.test.issue",
        message,
        path: [],
    }) as Issue;

export const createTestWorkspace = (overrides: Partial<Workspace> = {}): Workspace => ({
    id: "workspace-1",
    kind: "tab",
    title: "Workspace 1",
    path: ["workspace-1"],
    childrenIds: [],
    createdAt: 1,
    updatedAt: 1,
    ...overrides,
});

export const createTestTabSession = (
    overrides: Partial<WorkspaceTabSession> = {},
): WorkspaceTabSession => ({
    rootWorkspaceId: "workspace-1",
    activeWorkspaceId: "workspace-1",
    navigationPath: ["workspace-1"],
    createdAt: 1,
    updatedAt: 1,
    ...overrides,
});

export const createTestViewport = (
    overrides: Partial<GraphDocumentViewport> = {},
): GraphDocumentViewport => ({
    zoom: 1,
    tx: 0,
    ty: 0,
    ...overrides,
});

export const createTestGraphDocument = (overrides: Partial<GraphDocument> = {}): GraphDocument => ({
    formatVersion: GRAPH_DOCUMENT_FORMAT_VERSION,
    workspaceId: "workspace-1",
    contentJson: "",
    viewport: createTestViewport(),
    createdAt: 1,
    updatedAt: 1,
    ...overrides,
});

export const createTestNode = (overrides: Partial<Node> = {}): Node =>
    ({
        id: "node-1",
        ...overrides,
    }) as Node;

export const createTestCatalogItem = (): CatalogItem => BUFFER_LOGIC_ITEM;

export const createLogicEngineMock = () => {
    let tabCounter = 0;

    return {
        call: vi.fn(async (path: string) => {
            if (path === "/tab/create") {
                tabCounter += 1;
                return { tabId: `tab-${tabCounter}` };
            }

            return {};
        }),
    };
};

export const createUIEngineUseCaseTestContext = () => {
    const issues = [createTestIssue()];
    const container = createTestContainer();
    const document = createTestGraphDocument();
    const workspaceEntity = createTestWorkspace();
    const session = createTestTabSession();
    const node = createTestNode();
    const item = createTestCatalogItem();

    const fns = {
        getContainer: vi.fn<UIEngineUseCaseDeps["getContainer"]>(() => container),
        catalogGetItem: vi.fn<CatalogApi["query"]["getItem"]>(() => item),
        workspaceCreateTab: vi.fn<WorkspaceApi["createTab"]>(async () =>
            createOkResult({ tabId: "tab-1" }),
        ),
        workspaceOpen: vi.fn<WorkspaceApi["open"]>(() => createOkResult(workspaceEntity)),
        workspaceCloseTab: vi.fn<WorkspaceApi["closeTab"]>(() => createOkResult(session)),
        workspaceActiveWorkspaceId: vi.fn<WorkspaceApi["query"]["activeWorkspaceId"]>(
            () => "workspace-1",
        ),
        workspaceActiveTabId: vi.fn<WorkspaceApi["query"]["activeTabId"]>(() => "tab-1"),
        graphDocumentEnsureDocument: vi.fn<GraphDocumentApi["ensureDocument"]>(({ workspaceId }) =>
            createOkResult(createTestGraphDocument({ workspaceId })),
        ),
        graphDocumentSaveDocument: vi.fn<GraphDocumentApi["saveDocument"]>(
            ({ workspaceId, contentJson = "", viewport = createTestViewport(), extensions = {} }) =>
                createOkResult(
                    createTestGraphDocument({
                        workspaceId,
                        contentJson,
                        viewport,
                        extensions,
                    }),
                ),
        ),
        graphRendererOpen: vi.fn<GraphRendererApi["open"]>(() => createOkResult()),
        graphRendererClose: vi.fn<GraphRendererApi["close"]>(() => createOkResult(undefined)),
        graphRendererCreateNode: vi.fn<GraphRendererApi["createNode"]>(() => createOkResult(node)),
        graphRendererLoadDocument: vi.fn<GraphRendererApi["loadDocument"]>(
            ({ document: nextDocument }) => createOkResult(nextDocument),
        ),
        graphRendererExportDocument: vi.fn<GraphRendererApi["exportDocument"]>(() =>
            createOkResult(document),
        ),
        graphRendererIsOpen: vi.fn<GraphRendererApi["query"]["isOpen"]>(() => true),
        graphRendererActiveWorkspaceId: vi.fn<GraphRendererApi["query"]["activeWorkspaceId"]>(
            () => "workspace-1",
        ),
        graphRendererContainer: vi.fn<GraphRendererApi["query"]["container"]>(() => container),
        graphRendererGraph: vi.fn<GraphRendererApi["query"]["graph"]>(() => undefined),
        graphRendererSelectionCount: vi.fn<GraphRendererApi["query"]["selectionCount"]>(() => 0),
        persistActiveGraphDocument: vi.fn<UIEngineUseCaseInternals["persistActiveGraphDocument"]>(
            () => createOkResult(document),
        ),
        activateWorkspaceScene: vi.fn<UIEngineUseCaseInternals["activateWorkspaceScene"]>(
            (workspaceId) => createOkResult(createTestGraphDocument({ workspaceId })),
        ),
        syncRendererReady: vi.fn<UIEngineUseCaseInternals["syncRendererReady"]>(),
        issues,
    };

    const deps: UIEngineUseCaseDeps = {
        catalog: {
            query: {
                getItem: fns.catalogGetItem,
            },
        } as unknown as CatalogApi,
        workspace: {
            query: {
                activeWorkspaceId: fns.workspaceActiveWorkspaceId,
                activeTabId: fns.workspaceActiveTabId,
            },
            createTab: fns.workspaceCreateTab,
            open: fns.workspaceOpen,
            closeTab: fns.workspaceCloseTab,
        } as unknown as WorkspaceApi,
        graphDocument: {
            query: {
                getDocument: vi.fn(),
                hasDocument: vi.fn(),
                documents: vi.fn(),
                documentsByWorkspaceId: vi.fn(),
            },
            ensureDocument: fns.graphDocumentEnsureDocument,
            saveDocument: fns.graphDocumentSaveDocument,
        } as unknown as GraphDocumentApi,
        graphRenderer: {
            query: {
                graph: fns.graphRendererGraph,
                container: fns.graphRendererContainer,
                activeWorkspaceId: fns.graphRendererActiveWorkspaceId,
                isOpen: fns.graphRendererIsOpen,
                selectionCount: fns.graphRendererSelectionCount,
            },
            open: fns.graphRendererOpen,
            close: fns.graphRendererClose,
            createNode: fns.graphRendererCreateNode,
            loadDocument: fns.graphRendererLoadDocument,
            exportDocument: fns.graphRendererExportDocument,
        } as unknown as GraphRendererApi,
        getContainer: fns.getContainer,
    };

    const internals: UIEngineUseCaseInternals = {
        persistActiveGraphDocument: fns.persistActiveGraphDocument,
        activateWorkspaceScene: fns.activateWorkspaceScene,
        syncRendererReady: fns.syncRendererReady,
    };

    return {
        deps,
        internals,
        fns,
        fixtures: {
            container,
            document,
            workspace: workspaceEntity,
            session,
            node,
            item,
            issues,
        },
    };
};
