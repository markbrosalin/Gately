/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Edge } from "@antv/x6";
import type { UIEnginePlugin } from "../../model";
import { pickLogicValueClass } from "../../lib/logic-values";

const VERTICES_TOOL = "vertices" as const;

const findPathFromEvent = (
    e: Event | undefined,
    view?: { container?: Element },
): Element | null => {
    const target = (e as MouseEvent | undefined)?.target as Element | null;
    if (!target) return null;
    const path = target.tagName?.toLowerCase() === "path" ? target : target.closest("path");
    if (!path) return null;
    if (view?.container && !view.container.contains(path)) return null;
    return path;
};

export const edgeEditToolsPlugin: UIEnginePlugin = {
    name: "tools:edgeEdit",
    apply(graph, _ctx) {
        let activeEdge: Edge | null = null;

        const isEdgeSelected = (edge: Edge): boolean => graph.isSelected(edge);

        const getDecoratorRoot = (): Element | null => {
            const view = graph as unknown as { view?: { decorator?: Element } };
            return view.view?.decorator ?? null;
        };

        const removeVerticesTools = (edge: Edge) => {
            if (typeof edge.removeTools === "function") {
                edge.removeTools();
            }
            if (typeof edge.removeTool === "function") {
                edge.removeTool(VERTICES_TOOL);
            }
        };

        const pruneVerticesTools = () => {
            const edges = graph.getEdges?.() ?? [];
            for (const edge of edges) {
                const keepActive = !!activeEdge && activeEdge.id === edge.id && isEdgeSelected(edge);
                if (keepActive) continue;
                removeVerticesTools(edge);
            }

            // Fallback for orphan tool nodes left in decorator layer.
            const decorator = getDecoratorRoot();
            if (!decorator) return;

            const stale = decorator.querySelectorAll(".x6-cell-tool.x6-edge-tool-vertices");
            stale.forEach((toolEl) => {
                const tool = toolEl as Element;
                const toolEdgeId = tool.getAttribute("data-cell-id");
                if (toolEdgeId && activeEdge?.id === toolEdgeId && isEdgeSelected(activeEdge)) {
                    return;
                }

                const host = tool.closest(".x6-cell-tools");
                if (host) {
                    host.remove();
                    return;
                }
                tool.remove();
            });
        };

        const isTargetInsideActiveEdge = (target: EventTarget | null): boolean => {
            if (!activeEdge || !target || !(target instanceof Node)) return false;

            const view = graph.findViewByCell(activeEdge) as { container?: Element } | undefined;
            if (view?.container?.contains(target)) return true;

            const decorator = getDecoratorRoot();
            if (!decorator) return false;

            const activeTools = decorator.querySelectorAll(`[data-cell-id="${activeEdge.id}"]`);
            return Array.from(activeTools).some((node) => node.contains(target));
        };

        const toggle = (edge: Edge, enabled: boolean) => {
            if (enabled) {
                if (!isEdgeSelected(edge)) return;
                const value = pickLogicValueClass(edge.getAttrByPath("line/class"));
                removeVerticesTools(edge);
                edge.addTools({ name: VERTICES_TOOL, args: { className: value } });
                pruneVerticesTools();
            } else {
                removeVerticesTools(edge);
            }
        };

        const onEdgeAttrsChanged = ({ edge }: any) => {
            if (!activeEdge) return;
            if (activeEdge?.id !== edge.id) return;
            if (!isEdgeSelected(edge)) return;
            toggle(edge, true);
        };

        const showTools = () => {
            if (activeEdge) toggle(activeEdge, true);
        };

        const clearActive = () => {
            hideTools();
            activeEdge = null;
            pruneVerticesTools();
        };

        const hideTools = () => {
            if (activeEdge) toggle(activeEdge, false);
        };

        const onEdgeClick = ({ edge, e, view }: any) => {
            const pathTarget = findPathFromEvent(e, view);
            if (!pathTarget) return;
            if (activeEdge && activeEdge.id !== edge.id) {
                hideTools();
            }
            if (!isEdgeSelected(edge)) {
                graph.select(edge);
            }
            activeEdge = edge;
            if (activeEdge) showTools();
        };

        const onEdgeUnselected = ({ edge }: any) => {
            removeVerticesTools(edge);
            if (activeEdge?.id === edge.id) {
                activeEdge = null;
            }
            pruneVerticesTools();
        };

        const onBlankClick = () => {
            if (activeEdge) hideTools();
            activeEdge = null;
            pruneVerticesTools();
        };

        const onEdgeRemoved = ({ edge }: any) => {
            removeVerticesTools(edge);
            if (activeEdge?.id === edge.id) {
                activeEdge = null;
            }
            pruneVerticesTools();
        };

        const onCellClick = ({ cell }: any) => {
            if (cell?.isEdge?.()) return;
            clearActive();
        };

        const onSelectionChanged = () => {
            if (activeEdge && !isEdgeSelected(activeEdge)) {
                activeEdge = null;
            }
            pruneVerticesTools();
        };

        const onDocumentPointerDown = (evt: PointerEvent) => {
            if (!activeEdge) return;
            if (!isTargetInsideActiveEdge(evt.target)) {
                hideTools();
                activeEdge = null;
                pruneVerticesTools();
            }
        };

        const onNodeMouseDown = () => {
            clearActive();
        };

        const onBlankMouseDown = () => {
            clearActive();
        };

        graph.on("edge:change:attrs", onEdgeAttrsChanged);
        graph.on("edge:click", onEdgeClick);
        graph.on("edge:unselected", onEdgeUnselected);
        graph.on("blank:click", onBlankClick);
        graph.on("blank:mousedown", onBlankMouseDown);
        graph.on("edge:removed", onEdgeRemoved);
        graph.on("node:mousedown", onNodeMouseDown);
        graph.on("cell:click", onCellClick);
        graph.on("selection:changed", onSelectionChanged);
        document.addEventListener("pointerdown", onDocumentPointerDown, true);

        return () => {
            clearActive();
            graph.off("edge:change:attrs", onEdgeAttrsChanged);
            graph.off("edge:click", onEdgeClick);
            graph.off("edge:unselected", onEdgeUnselected);
            graph.off("blank:click", onBlankClick);
            graph.off("blank:mousedown", onBlankMouseDown);
            graph.off("edge:removed", onEdgeRemoved);
            graph.off("node:mousedown", onNodeMouseDown);
            graph.off("cell:click", onCellClick);
            graph.off("selection:changed", onSelectionChanged);
            document.removeEventListener("pointerdown", onDocumentPointerDown, true);
        };
    },
};

