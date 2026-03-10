import type { Graph } from "@antv/x6";
import { UIScopeSnapshot, UIScopeViewport } from "@gately/shared/infrastructure";

export const DEFAULT_VIEWPORT: UIScopeViewport = { zoom: 1, tx: 0, ty: 0 };

export const normalizeSnapshot = (snapshot?: Partial<UIScopeSnapshot> | null): UIScopeSnapshot => {
    const viewport: Partial<UIScopeViewport> = snapshot?.viewport ?? DEFAULT_VIEWPORT;

    const zoom = Number.isFinite(viewport.zoom) ? (viewport.zoom as number) : DEFAULT_VIEWPORT.zoom;
    const tx = Number.isFinite(viewport.tx) ? (viewport.tx as number) : DEFAULT_VIEWPORT.tx;
    const ty = Number.isFinite(viewport.ty) ? (viewport.ty as number) : DEFAULT_VIEWPORT.ty;

    return {
        contentJson: snapshot?.contentJson ?? "",
        viewport: { zoom, tx, ty },
    };
};

export const exportSnapshot = (graph: Graph): UIScopeSnapshot => {
    let contentJson = "";
    try {
        contentJson = JSON.stringify(graph.toJSON());
    } catch (err) {
        console.error("[UIEngine.exportSnapshot]: Failed to serialize graph.", err);
    }

    const { tx, ty } = graph.translate();

    return normalizeSnapshot({
        contentJson,
        viewport: { zoom: graph.zoom(), tx, ty },
    });
};

export const applySnapshot = (graph: Graph, snapshot: UIScopeSnapshot): void => {
    const raw = snapshot?.contentJson?.trim();

    if (!raw) {
        graph.clearCells();
    } else {
        try {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === "object") {
                graph.fromJSON(parsed);
            } else {
                graph.clearCells();
            }
        } catch (err) {
            console.error("[UIEngine.applySnapshot]: Invalid JSON. Clearing graph.", err);
            graph.clearCells();
        }
    }

    graph.zoomTo(snapshot.viewport.zoom);
    graph.translate(snapshot.viewport.tx, snapshot.viewport.ty);
};

