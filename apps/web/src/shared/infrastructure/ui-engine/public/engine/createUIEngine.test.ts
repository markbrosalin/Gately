/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, describe, expect, it, vi } from "vitest";
import { createUIEngine } from "./createUIEngine";
import { BUFFER_LOGIC_ITEM } from "@engine-presets/std-library/logic/logic/buffer";
import { createLogicEngineMock, createTestContainer } from "./__tests__/mocks";

const graphInstances: Array<{
    options: unknown;
    addNode: ReturnType<typeof vi.fn>;
    cleanSelection: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
    clearCells: ReturnType<typeof vi.fn>;
    fromJSON: ReturnType<typeof vi.fn>;
    getCellById: ReturnType<typeof vi.fn>;
    getSelectedCellCount: ReturnType<typeof vi.fn>;
    getSelectedCells: ReturnType<typeof vi.fn>;
    removeCells: ReturnType<typeof vi.fn>;
    removeEdge: ReturnType<typeof vi.fn>;
    removeNode: ReturnType<typeof vi.fn>;
    toJSON: ReturnType<typeof vi.fn>;
    translate: ReturnType<typeof vi.fn>;
    use: ReturnType<typeof vi.fn>;
    zoom: ReturnType<typeof vi.fn>;
    zoomTo: ReturnType<typeof vi.fn>;
    runtime: {
        json: Record<string, unknown>;
        nodes: Map<string, unknown>;
        edges: Map<string, unknown>;
        selectedCells: unknown[];
        tx: number;
        ty: number;
        zoom: number;
    };
}> = [];

vi.mock("@antv/x6", () => ({
    routerPresets: {
        orth: vi.fn(),
    },
    Selection: vi.fn().mockImplementation(() => ({
        clean: vi.fn(),
        dispose: vi.fn(),
    })),
    Graph: Object.assign(
        vi.fn().mockImplementation((options: unknown) => {
            const runtime = {
                json: { cells: [] as Array<Record<string, unknown>> },
                nodes: new Map<string, unknown>(),
                edges: new Map<string, unknown>(),
                selectedCells: [] as unknown[],
                tx: 0,
                ty: 0,
                zoom: 1,
            };
            const instance = {
                options,
                addNode: vi.fn((props: Record<string, unknown>) => {
                    const nodeId =
                        (props.id as string | undefined) ?? `node-${runtime.nodes.size + 1}`;
                    const node = {
                        id: nodeId,
                        isNode: () => true,
                        getData: vi.fn(() => props.data),
                        setData: vi.fn(),
                    };

                    runtime.nodes.set(nodeId, node);
                    runtime.json = {
                        cells: [...runtime.json.cells, { id: nodeId }],
                    };

                    return node;
                }),
                cleanSelection: vi.fn(() => {
                    runtime.selectedCells = [];
                }),
                dispose: vi.fn(),
                clearCells: vi.fn(() => {
                    runtime.json = { cells: [] };
                    runtime.nodes.clear();
                    runtime.edges.clear();
                    runtime.selectedCells = [];
                }),
                fromJSON: vi.fn((value: { cells: Array<Record<string, unknown>> }) => {
                    runtime.json = value;
                }),
                getCellById: vi.fn(
                    (cellId: string) => runtime.nodes.get(cellId) ?? runtime.edges.get(cellId),
                ),
                getSelectedCellCount: vi.fn(() => runtime.selectedCells.length),
                getSelectedCells: vi.fn(() => runtime.selectedCells),
                removeCells: vi.fn((cells: Array<{ id: string; isNode?: () => boolean }>) => {
                    cells.forEach((cell) => {
                        if (cell.isNode?.()) {
                            runtime.nodes.delete(cell.id);
                            return;
                        }

                        runtime.edges.delete(cell.id);
                    });
                    runtime.selectedCells = [];
                }),
                removeEdge: vi.fn((edgeId: string) => {
                    runtime.edges.delete(edgeId);
                }),
                removeNode: vi.fn((nodeId: string) => {
                    runtime.nodes.delete(nodeId);
                }),
                toJSON: vi.fn(() => runtime.json),
                translate: vi.fn((tx?: number, ty?: number) => {
                    if (typeof tx === "number" && typeof ty === "number") {
                        runtime.tx = tx;
                        runtime.ty = ty;
                    }

                    return { tx: runtime.tx, ty: runtime.ty };
                }),
                zoom: vi.fn(() => runtime.zoom),
                zoomTo: vi.fn((value: number) => {
                    runtime.zoom = value;
                }),
                use: vi.fn(),
                runtime,
            };
            graphInstances.push(instance);
            return instance;
        }),
        {
            registerPortLayout: vi.fn(),
        },
    ),
}));

describe("createUIEngine", () => {
    afterEach(() => {
        graphInstances.length = 0;
        vi.clearAllMocks();
    });

    it("exposes query/useCases API and auto-imports the standard library", async () => {
        const engine = createUIEngine({
            logicEngine: createLogicEngineMock() as any,
        });

        expect(engine.query.catalog.hasLibrary("std")).toBe(true);
        expect(engine.query.engine.isMounted()).toBe(false);
        expect(engine.query.engine.isReady()).toBe(false);

        engine.mount.setContainer(createTestContainer());

        expect(engine.query.engine.isMounted()).toBe(true);
        expect(engine.query.engine.isReady()).toBe(true);

        const createTabResult = await engine.useCases.createTab({});

        if (!createTabResult.ok) {
            throw new Error("Expected createTab to succeed");
        }

        expect(engine.query.workspace.activeTabId()).toBe(createTabResult.value.tabId);
        expect(engine.query.workspace.activeWorkspaceId()).toBe(createTabResult.value.tabId);
        expect(engine.query.graphDocument.hasDocument(createTabResult.value.tabId)).toBe(true);
        expect(engine.query.graphRenderer.isMounted()).toBe(true);
        expect(engine.query.engine.isReady()).toBe(true);
    });

    it("persists the current document before switching tabs and restores it on openWorkspace", async () => {
        const engine = createUIEngine({
            logicEngine: createLogicEngineMock() as any,
        });

        engine.mount.setContainer(createTestContainer());

        const firstTabResult = await engine.useCases.createTab({});
        if (!firstTabResult.ok) {
            throw new Error("Expected first createTab to succeed");
        }

        const firstTabId = firstTabResult.value.tabId;
        graphInstances.at(-1)!.runtime.json = {
            cells: [{ id: "saved-node" }],
        };

        const secondTabResult = await engine.useCases.createTab({});
        if (!secondTabResult.ok) {
            throw new Error("Expected second createTab to succeed");
        }

        const savedFirstDocument = engine.query.graphDocument.getDocument(firstTabId);
        expect(savedFirstDocument?.contentJson).toBe(
            JSON.stringify({ cells: [{ id: "saved-node" }] }),
        );

        const reopenResult = engine.useCases.openWorkspace({
            workspaceId: firstTabId,
        });

        if (!reopenResult.ok) {
            throw new Error("Expected openWorkspace to succeed");
        }

        expect(engine.query.graphRenderer.activeWorkspaceId()).toBe(firstTabId);
        expect(graphInstances.at(-1)?.runtime.json).toEqual({
            cells: [{ id: "saved-node" }],
        });
    });

    it("creates a node from a catalog item and persists the graph document only on explicit save", async () => {
        const engine = createUIEngine({
            logicEngine: createLogicEngineMock() as any,
        });

        engine.mount.setContainer(createTestContainer());

        const tabResult = await engine.useCases.createTab({});
        if (!tabResult.ok) {
            throw new Error("Expected createTab to succeed");
        }

        const createNodeResult = engine.useCases.createNodeFromCatalogItem({
            ref: BUFFER_LOGIC_ITEM.ref,
        });

        if (!createNodeResult.ok) {
            throw new Error("Expected createNodeFromCatalogItem to succeed");
        }

        const documentBeforeSave = engine.query.graphDocument.getDocument(tabResult.value.tabId);
        expect(documentBeforeSave?.contentJson).toBe("");

        const saveResult = engine.useCases.saveActiveDocument();
        if (!saveResult.ok) {
            throw new Error("Expected saveActiveDocument to succeed");
        }

        const savedDocument = engine.query.graphDocument.getDocument(tabResult.value.tabId);
        expect(savedDocument).toBeDefined();
        expect(JSON.parse(savedDocument!.contentJson)).toEqual({
            cells: [{ id: "node-1" }],
        });
    });

    it("closes the active tab and activates the next available workspace scene", async () => {
        const engine = createUIEngine({
            logicEngine: createLogicEngineMock() as any,
        });

        engine.mount.setContainer(createTestContainer());

        const firstTabResult = await engine.useCases.createTab({});
        const secondTabResult = await engine.useCases.createTab({});

        if (!firstTabResult.ok || !secondTabResult.ok) {
            throw new Error("Expected createTab to succeed");
        }

        const closeResult = engine.useCases.closeTab({
            tabId: secondTabResult.value.tabId,
        });

        if (!closeResult.ok) {
            throw new Error("Expected closeTab to succeed");
        }

        expect(engine.query.workspace.activeTabId()).toBe(firstTabResult.value.tabId);
        expect(engine.query.workspace.activeWorkspaceId()).toBe(firstTabResult.value.tabId);
        expect(engine.query.graphRenderer.activeWorkspaceId()).toBe(firstTabResult.value.tabId);
    });
});
