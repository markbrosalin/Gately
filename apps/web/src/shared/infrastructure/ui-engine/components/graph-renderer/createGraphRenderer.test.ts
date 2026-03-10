/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildSharedServices } from "../../shared-services";
import { createGraphRenderer } from "./createGraphRenderer";
import { GRAPH_DOCUMENT_FORMAT_VERSION, type GraphDocument } from "@engine-model";
import { BUFFER_LOGIC_ITEM } from "@engine-presets/std-library/logic/logic/buffer";

const graphInstances: Array<{
    options: unknown;
    addNode: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
    clearCells: ReturnType<typeof vi.fn>;
    fromJSON: ReturnType<typeof vi.fn>;
    getCellById: ReturnType<typeof vi.fn>;
    getSelectedCellCount: ReturnType<typeof vi.fn>;
    removeNode: ReturnType<typeof vi.fn>;
    toJSON: ReturnType<typeof vi.fn>;
    translate: ReturnType<typeof vi.fn>;
    zoom: ReturnType<typeof vi.fn>;
    zoomTo: ReturnType<typeof vi.fn>;
    runtime: {
        json: Record<string, unknown>;
        nodes: Map<string, unknown>;
        tx: number;
        ty: number;
        zoom: number;
    };
}> = [];

vi.mock("@antv/x6", () => ({
    routerPresets: {
        orth: vi.fn(),
    },
    Graph: Object.assign(
        vi.fn().mockImplementation((options: unknown) => {
            const runtime = {
                json: { cells: [] },
                nodes: new Map<string, unknown>(),
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
                dispose: vi.fn(),
                clearCells: vi.fn(() => {
                    runtime.json = { cells: [] };
                    runtime.nodes.clear();
                }),
                fromJSON: vi.fn((value: Record<string, unknown>) => {
                    (runtime as any).json = value;
                }),
                getCellById: vi.fn((nodeId: string) => runtime.nodes.get(nodeId)),
                getSelectedCellCount: vi.fn(() => 0),
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

    it("opens and closes renderer through the public component API", () => {
        const shared = buildSharedServices();
        const renderer = createGraphRenderer({
            external: {},
            getSharedService: shared.getService,
        });
        const container = {} as HTMLDivElement;

        const openResult = renderer.open({
            workspaceId: "workspace-1",
            container,
        });

        expect(openResult.ok).toBe(true);
        expect(renderer.query.isOpen()).toBe(true);
        expect(renderer.query.activeWorkspaceId()).toBe("workspace-1");
        expect(renderer.query.container()).toBe(container);
        expect(renderer.query.selectionCount()).toBe(0);

        const closeResult = renderer.close();

        expect(closeResult.ok).toBe(true);
        expect(renderer.query.isOpen()).toBe(false);
        expect(renderer.query.activeWorkspaceId()).toBeUndefined();
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

        renderer.open({
            workspaceId: "workspace-1",
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

    it("loads and exports a document through the public component API", () => {
        const dateNowSpy = vi.spyOn(Date, "now").mockReturnValue(1234);

        const shared = buildSharedServices();
        const renderer = createGraphRenderer({
            external: {},
            getSharedService: shared.getService,
        });

        renderer.open({
            workspaceId: "workspace-1",
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

        const closeResult = renderer.close();

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

        renderer.open({
            workspaceId: "workspace-1",
            container: {} as HTMLDivElement,
        });

        const mismatchedWorkspaceResult = renderer.loadDocument({
            document: createDocument({ workspaceId: "workspace-2" }),
        });
        const invalidJsonResult = renderer.loadDocument({
            document: createDocument({ contentJson: "{bad-json" }),
        });

        if (mismatchedWorkspaceResult.ok || invalidJsonResult.ok) {
            throw new Error("Expected invalid renderer document loads to fail");
        }

        expect(mismatchedWorkspaceResult.issues[0]?.code).toBe(
            "graph-renderer.use-case.document.workspace-id.mismatch",
        );
        expect(invalidJsonResult.issues[0]?.code).toBe(
            "graph-renderer.use-case.document.content-json.invalid",
        );
        expect(graphInstances[0]?.fromJSON).not.toHaveBeenCalled();
    });
});


