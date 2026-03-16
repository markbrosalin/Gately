/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildSharedServices } from "../../shared-services";
import { createGraphRenderer } from "./createGraphRenderer";
import { GRAPH_DOCUMENT_FORMAT_VERSION, type GraphDocument } from "@engine-model/graph-document";
import { BUFFER_LOGIC_ITEM } from "@engine-presets/std-library/logic/logic/buffer";

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
                json: { cells: [] },
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
                fromJSON: vi.fn((value: Record<string, unknown>) => {
                    (runtime as any).json = value;
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

describe("createGraphRenderer", () => {
    afterEach(() => {
        graphInstances.length = 0;
        vi.clearAllMocks();
    });

    const createDocument = (overrides?: Partial<GraphDocument>): GraphDocument => ({
        formatVersion: GRAPH_DOCUMENT_FORMAT_VERSION,
        workspaceId: "workspace-1",
        contentJson: JSON.stringify({ cells: [{ id: "node-1" }] }),
        viewport: {
            zoom: 1.5,
            tx: 15,
            ty: 30,
        },
        createdAt: 1,
        ...overrides,
    });

    it("mounts and unmounts renderer through the public component API", () => {
        const shared = buildSharedServices();
        const renderer = createGraphRenderer({
            external: {},
            getSharedService: shared.getService,
        });
        const container = {} as HTMLDivElement;
        const onGraphMount = vi.fn();
        const onGraphUnmount = vi.fn();

        renderer.lifecycle.onGraphMount(onGraphMount);
        renderer.lifecycle.onGraphUnmount(onGraphUnmount);

        const mountResult = renderer.mount({
            container,
        });

        expect(mountResult.ok).toBe(true);
        expect(renderer.query.isMounted()).toBe(true);
        expect(renderer.query.activeWorkspaceId()).toBeUndefined();
        expect(renderer.query.container()).toBe(container);
        expect(renderer.query.hasSelection()).toBe(false);
        expect(renderer.query.selectionCount()).toBe(0);
        expect(graphInstances[0]?.use).toHaveBeenCalledTimes(1);
        expect(onGraphMount).toHaveBeenCalledWith({
            graph: graphInstances[0] as never,
            container,
        });

        const unmountResult = renderer.unmount();

        expect(unmountResult.ok).toBe(true);
        expect(renderer.query.isMounted()).toBe(false);
        expect(renderer.query.activeWorkspaceId()).toBeUndefined();
        expect(onGraphUnmount).toHaveBeenCalledWith({
            graph: graphInstances[0] as never,
            container,
        });
    });

    it("creates a node from a catalog item through the public component API", () => {
        const shared = buildSharedServices();
        const renderer = createGraphRenderer({
            external: {},
            getSharedService: shared.getService,
        });

        const closedResult = renderer.createNode({ item: BUFFER_LOGIC_ITEM });

        if (closedResult.ok) {
            throw new Error("Expected createNode to fail while renderer is closed");
        }

        expect(closedResult.issues[0]?.code).toBe("graph-renderer.use-case.renderer.not-open");

        renderer.mount({
            container: {} as HTMLDivElement,
        });

        const createResult = renderer.createNode({
            item: BUFFER_LOGIC_ITEM,
            position: { x: 40, y: 50 },
        });

        if (!createResult.ok) {
            throw new Error("Expected createNode to succeed");
        }

        expect(graphInstances[0]?.addNode).toHaveBeenCalledWith(
            expect.objectContaining({
                x: 40,
                y: 50,
                data: expect.objectContaining({
                    ref: BUFFER_LOGIC_ITEM.ref,
                    refKey: "std::logic::buffer",
                    kind: "logic",
                }),
            }),
        );
        expect(createResult.value.id).toBe("node-1");

        const invalidItemResult = renderer.createNode({
            item: {
                ...BUFFER_LOGIC_ITEM,
                layout: {
                    ...BUFFER_LOGIC_ITEM.layout,
                    width: 0,
                },
            },
        });

        if (invalidItemResult.ok) {
            throw new Error("Expected invalid catalog item build to fail");
        }

        expect(invalidItemResult.issues[0]?.code).toBe(
            "graph-renderer.use-case.node.build.invalid",
        );
    });

    it("reads selection state and removes selected cells through the public component API", () => {
        const shared = buildSharedServices();
        const renderer = createGraphRenderer({
            external: {},
            getSharedService: shared.getService,
        });

        renderer.mount({
            container: {} as HTMLDivElement,
        });

        const selectedNode = {
            id: "node-1",
            isNode: () => true,
            isEdge: () => false,
        };
        const selectedEdge = {
            id: "edge-1",
            isNode: () => false,
            isEdge: () => true,
        };
        graphInstances[0]?.runtime.nodes.set("node-1", selectedNode);
        graphInstances[0]?.runtime.edges.set("edge-1", selectedEdge);
        graphInstances[0]!.runtime.selectedCells = [selectedNode, selectedEdge];

        expect(renderer.query.hasSelection()).toBe(true);
        expect(renderer.query.selectionCount()).toBe(2);
        expect(renderer.query.selectedCellIds()).toEqual(["node-1", "edge-1"]);
        expect(renderer.query.selectedNodeIds()).toEqual(["node-1"]);
        expect(renderer.query.selectedEdgeIds()).toEqual(["edge-1"]);

        const removeSelectionResult = renderer.removeSelection();

        expect(removeSelectionResult.ok).toBe(true);
        expect(graphInstances[0]?.removeCells).toHaveBeenCalledWith([selectedNode, selectedEdge]);
        expect(graphInstances[0]?.cleanSelection).toHaveBeenCalledTimes(1);
    });

    it("removes nodes and edges by id and returns issues when a cell is missing", () => {
        const shared = buildSharedServices();
        const renderer = createGraphRenderer({
            external: {},
            getSharedService: shared.getService,
        });

        const closedRemoveResult = renderer.removeNode({ nodeId: "node-1" });
        if (closedRemoveResult.ok) {
            throw new Error("Expected removeNode to fail while renderer is closed");
        }
        expect(closedRemoveResult.issues[0]?.code).toBe("graph-renderer.use-case.renderer.not-open");

        renderer.mount({
            container: {} as HTMLDivElement,
        });

        const node = {
            id: "node-1",
            isNode: () => true,
            isEdge: () => false,
        };
        const edge = {
            id: "edge-1",
            isNode: () => false,
            isEdge: () => true,
        };
        graphInstances[0]?.runtime.nodes.set("node-1", node);
        graphInstances[0]?.runtime.edges.set("edge-1", edge);

        expect(renderer.removeNode({ nodeId: "node-1" }).ok).toBe(true);
        expect(graphInstances[0]?.removeNode).toHaveBeenCalledWith("node-1");

        expect(renderer.removeEdge({ edgeId: "edge-1" }).ok).toBe(true);
        expect(graphInstances[0]?.removeEdge).toHaveBeenCalledWith("edge-1");

        const missingNodeResult = renderer.removeNode({ nodeId: "missing-node" });
        const missingEdgeResult = renderer.removeEdge({ edgeId: "missing-edge" });

        if (missingNodeResult.ok || missingEdgeResult.ok) {
            throw new Error("Expected missing cell removal to fail");
        }

        expect(missingNodeResult.issues[0]?.code).toBe("graph-renderer.use-case.node.not-found");
        expect(missingEdgeResult.issues[0]?.code).toBe("graph-renderer.use-case.edge.not-found");
    });

    it("loads and exports a document through the public component API", () => {
        const dateNowSpy = vi.spyOn(Date, "now").mockReturnValue(1234);

        const shared = buildSharedServices();
        const renderer = createGraphRenderer({
            external: {},
            getSharedService: shared.getService,
        });

        renderer.mount({
            container: {} as HTMLDivElement,
        });

        const document = createDocument();
        const loadResult = renderer.loadDocument({ document });

        if (!loadResult.ok) {
            throw new Error("Expected loadDocument to succeed");
        }

        expect(graphInstances[0]?.fromJSON).toHaveBeenCalledWith({
            cells: [{ id: "node-1" }],
        });
        expect(graphInstances[0]?.zoomTo).toHaveBeenCalledWith(1.5);
        expect(graphInstances[0]?.translate).toHaveBeenCalledWith(15, 30);

        const exportResult = renderer.exportDocument();

        if (!exportResult.ok) {
            throw new Error("Expected exportDocument to succeed");
        }

        expect(exportResult.value).toEqual({
            formatVersion: GRAPH_DOCUMENT_FORMAT_VERSION,
            workspaceId: "workspace-1",
            contentJson: JSON.stringify({ cells: [{ id: "node-1" }] }),
            viewport: {
                zoom: 1.5,
                tx: 15,
                ty: 30,
            },
            createdAt: 1234,
        });

        const closeResult = renderer.unmount();

        expect(closeResult.ok).toBe(true);
        expect(graphInstances[0]?.dispose).toHaveBeenCalledTimes(1);

        dateNowSpy.mockRestore();
    });

    it("returns issues when document I/O is called in an invalid renderer state", () => {
        const shared = buildSharedServices();
        const renderer = createGraphRenderer({
            external: {},
            getSharedService: shared.getService,
        });

        const closedLoadResult = renderer.loadDocument({
            document: createDocument(),
        });
        const closedExportResult = renderer.exportDocument();

        if (closedLoadResult.ok || closedExportResult.ok) {
            throw new Error("Expected document I/O to fail while renderer is closed");
        }

        expect(closedLoadResult.issues[0]?.code).toBe("graph-renderer.use-case.renderer.not-open");
        expect(closedExportResult.issues[0]?.code).toBe(
            "graph-renderer.use-case.renderer.not-open",
        );

        renderer.mount({
            container: {} as HTMLDivElement,
        });

        const invalidJsonResult = renderer.loadDocument({
            document: createDocument({ contentJson: "{bad-json" }),
        });

        if (invalidJsonResult.ok) {
            throw new Error("Expected invalid renderer document loads to fail");
        }
        expect(invalidJsonResult.issues[0]?.code).toBe(
            "graph-renderer.use-case.document.content-json.invalid",
        );
        expect(graphInstances[0]?.fromJSON).not.toHaveBeenCalled();
    });
});


