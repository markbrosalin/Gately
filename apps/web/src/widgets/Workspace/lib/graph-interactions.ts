/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Graph } from "@antv/x6";
import type { ContextTarget } from "./types";

type AttachWorkspaceGraphInteractionsOptions = {
    graph: Graph;
    openContextMenuAt: (x: number, y: number, target: ContextTarget) => void;
    closeContextMenu: () => void;
    setMenuTarget: (target: ContextTarget) => void;
    bumpSelection: () => void;
};

const EDGE_SELECTED_CLASS = "edge-selected";

const shouldIgnoreKey = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return false;
    const tag = target.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    if (target.isContentEditable) return true;
    return false;
};

const addEdgeSelectedClass = (edge: any) => {
    const current = (edge?.getAttrByPath?.("line/class") ?? "") as string;
    const tokens = current.split(/\s+/).filter(Boolean);
    if (tokens.includes(EDGE_SELECTED_CLASS)) return;
    tokens.push(EDGE_SELECTED_CLASS);
    edge?.setAttrByPath?.("line/class", tokens.join(" ").trim());
};

const removeEdgeSelectedClass = (edge: any) => {
    const current = (edge?.getAttrByPath?.("line/class") ?? "") as string;
    const tokens = current.split(/\s+/).filter(Boolean);
    const next = tokens.filter((t) => t !== EDGE_SELECTED_CLASS);
    edge?.setAttrByPath?.("line/class", next.join(" ").trim());
};

const enforceNodePriority = (graph: Graph) => {
    const selected = graph.getSelectedCells?.() ?? [];
    const hasNode = selected.some((c) => c?.isNode?.());
    if (!hasNode) return;
    const edges = selected.filter((c) => c?.isEdge?.());
    if (!edges.length) return;
    graph.unselect(edges);
};

export const attachWorkspaceGraphInteractions = (
    opts: AttachWorkspaceGraphInteractionsOptions,
): (() => void) => {
    const { graph, openContextMenuAt, closeContextMenu, setMenuTarget, bumpSelection } = opts;

    const onCellContextMenu = ({ cell, e }: any) => {
        if (!cell || !e) return;
        if (!cell.isNode?.() && !cell.isEdge?.()) return;
        e.preventDefault();
        const additive = e?.shiftKey || e?.ctrlKey || e?.metaKey;
        if (graph.isSelected(cell)) {
            // keep current multi-selection
        } else if (additive) {
            if (!graph.isSelected(cell)) graph.select(cell);
        } else {
            graph.resetSelection(cell);
        }
        bumpSelection();
        enforceNodePriority(graph);
        openContextMenuAt(e.clientX, e.clientY, cell.isNode?.() ? "node" : "edge");
    };

    const onBlankContextMenu = ({ e }: any) => {
        e?.preventDefault?.();
        setMenuTarget("blank");
        bumpSelection();
        closeContextMenu();
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (shouldIgnoreKey(e)) return;
        if (e.key !== "Delete" && e.key !== "Backspace") return;
        const selected = graph.getSelectedCells?.() ?? [];
        if (!selected.length) return;
        e.preventDefault();
        graph.removeCells(selected);
    };

    const onEdgeSelected = ({ edge }: any) => {
        addEdgeSelectedClass(edge);
    };

    const onEdgeUnselected = ({ edge }: any) => {
        removeEdgeSelectedClass(edge);
    };

    const onSelectionChanged = () => {
        enforceNodePriority(graph);
        bumpSelection();
    };

    graph.on("cell:selected", bumpSelection);
    graph.on("cell:unselected", bumpSelection);
    graph.on("edge:selected", onEdgeSelected);
    graph.on("edge:unselected", onEdgeUnselected);
    graph.on("selection:changed", onSelectionChanged);
    graph.on("cell:contextmenu", onCellContextMenu);
    graph.on("blank:contextmenu", onBlankContextMenu);
    window.addEventListener("keydown", onKeyDown);

    return () => {
        graph.off("cell:selected", bumpSelection);
        graph.off("cell:unselected", bumpSelection);
        graph.off("edge:selected", onEdgeSelected);
        graph.off("edge:unselected", onEdgeUnselected);
        graph.off("selection:changed", onSelectionChanged);
        graph.off("cell:contextmenu", onCellContextMenu);
        graph.off("blank:contextmenu", onBlankContextMenu);
        window.removeEventListener("keydown", onKeyDown);
    };
};

