import {
    DEFAULT_GRAPH_DOCUMENT_VIEWPORT,
    GRAPH_DOCUMENT_FORMAT_VERSION,
    type GraphDocument,
} from "@engine-model/graph-document";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { GraphRendererInstanceService } from "../instance";
import {
    createGraphRendererDocumentApi,
    parseGraphRendererDocumentContentJson,
} from "./createGraphRendererDocumentService";

const createDocument = (overrides?: Partial<GraphDocument>): GraphDocument => ({
    formatVersion: GRAPH_DOCUMENT_FORMAT_VERSION,
    workspaceId: "workspace-1",
    contentJson: JSON.stringify({ cells: [{ id: "node-1" }] }),
    viewport: {
        zoom: 1.5,
        tx: 12,
        ty: 24,
    },
    createdAt: 1,
    ...overrides,
});

const createGraph = () => {
    const runtime = {
        zoom: 1,
        tx: 0,
        ty: 0,
        json: { cells: [] as Array<Record<string, unknown>> },
    };

    return {
        clearCells: vi.fn(() => {
            runtime.json = { cells: [] };
        }),
        fromJSON: vi.fn((value: Record<string, unknown>) => {
            runtime.json = value as typeof runtime.json;
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
    };
};

describe("createGraphRendererDocumentService", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.clearAllMocks();
    });

    it("loads parsed document content into the active graph", () => {
        const graph = createGraph();
        const instance: GraphRendererInstanceService = {
            container: () => ({}) as HTMLDivElement,
            graph: () => graph as never,
            mount: vi.fn() as never,
            unmount: vi.fn(),
        };
        const service = createGraphRendererDocumentApi(instance);
        const document = createDocument();

        service.loadDocument({
            document,
            contentJson: { cells: [{ id: "node-1" }] },
        });

        expect(graph.fromJSON).toHaveBeenCalledWith({ cells: [{ id: "node-1" }] });
        expect(graph.zoomTo).toHaveBeenCalledWith(1.5);
        expect(graph.translate).toHaveBeenCalledWith(12, 24);
    });

    it("clears graph cells when loading an empty document", () => {
        const graph = createGraph();
        const instance: GraphRendererInstanceService = {
            container: () => ({}) as HTMLDivElement,
            graph: () => graph as never,
            mount: vi.fn() as never,
            unmount: vi.fn(),
        };
        const service = createGraphRendererDocumentApi(instance);

        service.loadDocument({
            document: createDocument({
                contentJson: "",
                viewport: DEFAULT_GRAPH_DOCUMENT_VIEWPORT,
            }),
            contentJson: undefined,
        });

        expect(graph.clearCells).toHaveBeenCalledTimes(1);
        expect(graph.fromJSON).not.toHaveBeenCalled();
    });

    it("exports a full graph document from the active graph", () => {
        vi.spyOn(Date, "now").mockReturnValue(1234);

        const graph = createGraph();
        graph.fromJSON({ cells: [{ id: "node-1" }] });
        graph.zoomTo(1.25);
        graph.translate(40, 80);

        const instance: GraphRendererInstanceService = {
            container: () => ({}) as HTMLDivElement,
            graph: () => graph as never,
            mount: vi.fn() as never,
            unmount: vi.fn(),
        };
        const service = createGraphRendererDocumentApi(instance);

        expect(service.exportDocument("workspace-1")).toEqual({
            formatVersion: GRAPH_DOCUMENT_FORMAT_VERSION,
            workspaceId: "workspace-1",
            contentJson: JSON.stringify({ cells: [{ id: "node-1" }] }),
            viewport: {
                zoom: 1.25,
                tx: 40,
                ty: 80,
            },
            createdAt: 1234,
        });
    });

    it("parses contentJson only when it is a valid object payload", () => {
        expect(parseGraphRendererDocumentContentJson("")).toMatchObject({
            ok: true,
            value: undefined,
        });

        expect(parseGraphRendererDocumentContentJson('{"cells":[]}')).toMatchObject({
            ok: true,
            value: { cells: [] },
        });

        expect(parseGraphRendererDocumentContentJson("[]")).toMatchObject({
            ok: false,
        });

        expect(parseGraphRendererDocumentContentJson("{bad-json")).toMatchObject({
            ok: false,
        });
    });
});


