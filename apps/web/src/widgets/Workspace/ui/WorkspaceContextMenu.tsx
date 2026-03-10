import {
    ContextMenu,
    ContextMenuRootProps,
    useContextMenuContext,
} from "@kobalte/core/context-menu";
import { contextMenuStyles as styles } from "@gately/shared/ui/ContextMenu/styles";
import { Component, ParentComponent, createEffect } from "solid-js";
import type {
    AnchorReadySetter,
    WorkspaceController,
} from "../lib/types";

const ContextMenuRoot = ContextMenu as ParentComponent<ContextMenuRootProps & { open: boolean }>;

const ContextMenuAnchorBridge: Component<{
    onReady: (setter: AnchorReadySetter) => void;
}> = (props) => {
    const ctx = useContextMenuContext();
    createEffect(() => {
        props.onReady(ctx.setAnchorRect);
    });
    return null;
};

type WorkspaceContextMenuProps = {
    contextMenu: WorkspaceController["contextMenu"];
    getSelectionCount: WorkspaceController["getSelectionCount"];
    removeSelected: WorkspaceController["removeSelected"];
};

export const WorkspaceContextMenu: Component<WorkspaceContextMenuProps> = (props) => {
    return (
        <ContextMenuRoot
            fitViewport
            overflowPadding={8}
            placement="bottom-start"
            modal={false}
            open={props.contextMenu.menuOpen()}
            onOpenChange={props.contextMenu.onOpenChange}
        >
            <ContextMenuAnchorBridge onReady={props.contextMenu.registerAnchorSetter} />
            <ContextMenu.Portal>
                <ContextMenu.Content
                    class={styles.content()}
                    onPointerDownOutside={props.contextMenu.closeContextMenu}
                    onInteractOutside={props.contextMenu.closeContextMenu}
                    onClick={props.contextMenu.closeContextMenu}
                >
                    <ContextMenu.Item
                        class={styles.item()}
                        disabled={
                            props.getSelectionCount() === 0 ||
                            props.contextMenu.menuTarget() === "blank"
                        }
                        closeOnSelect
                        onSelect={props.removeSelected}
                    >
                        <span class={styles.itemLabel()}>Remove selected</span>
                        <span class={styles.itemShortcut()}>Del</span>
                    </ContextMenu.Item>
                </ContextMenu.Content>
            </ContextMenu.Portal>
        </ContextMenuRoot>
    );
};

