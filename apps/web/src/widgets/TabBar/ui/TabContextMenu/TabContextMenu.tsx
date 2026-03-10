import { ParentComponent } from "solid-js";
import { ContextMenu } from "@kobalte/core/context-menu";
import { useTabCtx } from "../TabButton/TabProvider";
import { contextMenuStyles as styles } from "@gately/shared/ui/ContextMenu/styles";

export const TabContextMenu: ParentComponent = (props) => {
    const ctx = useTabCtx();

    return (
        <ContextMenu fitViewport overflowPadding={8} modal={false} placement="bottom-start">
            <ContextMenu.Trigger class="contents">{props.children}</ContextMenu.Trigger>
            <ContextMenu.Portal>
                <ContextMenu.Content class={styles.content()}>
                    <ContextMenu.Item
                        class={styles.item()}
                        closeOnSelect
                        onSelect={() => ctx.setIsTitleEditing(true)}
                    >
                        <span class={styles.itemLabel()}>Rename File</span>
                    </ContextMenu.Item>

                    <ContextMenu.Separator class={`${styles.separator()}`} />

                    <ContextMenu.Item class={styles.item()} closeOnSelect>
                        <span class={styles.itemLabel()}>Clone Tab</span>
                    </ContextMenu.Item>
                    <ContextMenu.Item class={styles.item()} closeOnSelect>
                        <span class={styles.itemLabel()}>Pin Tab</span>
                    </ContextMenu.Item>

                    <ContextMenu.Separator class={styles.separator()} />

                    <ContextMenu.Item class={styles.item()} closeOnSelect>
                        <span class={styles.itemLabel()}>Close Tab</span>
                    </ContextMenu.Item>
                    <ContextMenu.Item class={styles.item()} closeOnSelect>
                        <span class={styles.itemLabel()}>Close Other Tabs</span>
                    </ContextMenu.Item>
                    <ContextMenu.Item class={styles.item()} closeOnSelect>
                        <span class={styles.itemLabel()}>Close All Tabs</span>
                    </ContextMenu.Item>
                </ContextMenu.Content>
            </ContextMenu.Portal>
        </ContextMenu>
    );
};

