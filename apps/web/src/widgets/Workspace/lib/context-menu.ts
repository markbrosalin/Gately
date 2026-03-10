import { createSignal } from "solid-js";
import type { XYCoords } from "@gately/shared/types";
import type {
    AnchorReadySetter,
    ContextTarget,
    WorkspaceContextMenuController,
} from "./types";

export const useWorkspaceContextMenu = (): WorkspaceContextMenuController => {
    const [menuOpen, setMenuOpen] = createSignal(false);
    const [menuTarget, setMenuTarget] = createSignal<ContextTarget>("blank");
    const [menuPoint, setMenuPoint] = createSignal<XYCoords | null>(null);
    let setAnchorRect: AnchorReadySetter | undefined;

    const openContextMenuAt = (x: number, y: number, target: ContextTarget) => {
        setMenuTarget(target);
        setMenuPoint({ x, y });
        setAnchorRect?.({ x, y });
        setMenuOpen(true);
    };

    const closeContextMenu = () => {
        setMenuOpen(false);
    };

    const onOpenChange = (open: boolean) => {
        setMenuOpen(open);
        if (!open) {
            setMenuTarget("blank");
            setMenuPoint(null);
        }
    };

    const registerAnchorSetter = (setter: AnchorReadySetter) => {
        setAnchorRect = setter;
        const point = menuPoint();
        if (point) setAnchorRect?.(point);
    };

    return {
        menuOpen,
        menuTarget,
        openContextMenuAt,
        closeContextMenu,
        onOpenChange,
        setMenuTarget,
        registerAnchorSetter,
    };
};

