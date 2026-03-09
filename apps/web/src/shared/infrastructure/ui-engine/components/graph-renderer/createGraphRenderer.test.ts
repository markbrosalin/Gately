/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildSharedServices } from "../../shared-services";
import { createGraphRenderer } from "./createGraphRenderer";
import {
    GRAPH_DOCUMENT_FORMAT_VERSION,
    type GraphDocument,
} from "@gately/shared/infrastructure/ui-engine/model";

const graphInstances: Array<{
    options: unknown;
    dispose: ReturnType<typeof vi.fn>;
    clearCells: ReturnType<typeof vi.fn>;
    fromJSON: ReturnType<typeof vi.fn>;
    getSelectedCellCount: ReturnType<typeof vi.fn>;
    toJSON: ReturnType<typeof vi.fn>;
    translate: ReturnType<typeof vi.fn>;
    zoom: ReturnType<typeof vi.fn>;
    zoomTo: ReturnType<typeof vi.fn>;
    runtime: {
        json: Record<string, unknown>;
        tx: number;
        ty: number;
        zoom: number;
    };
}> = [];

vi.mock("@antv/x6", () => ({
    routerPresets: {
        orth: vi.fn(),
    },
    Graph: vi.fn().mockImplementation((options: unknown) => {
        const runtime = {
            json: { cells: [] },
            tx: 0,
            ty: 0,
            zoom: 1,
        };
        const instance = {
            options,
            dispose: vi.fn(),
            clearCells: vi.fn(() => {
                runtime.json = { cells: [] };
            }),
            fromJSON: vi.fn((value: Record<string, unknown>) => {
                (runtime as any).json = value;
            }),
            getSelectedCellCount: vi.fn(() => 0),
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
