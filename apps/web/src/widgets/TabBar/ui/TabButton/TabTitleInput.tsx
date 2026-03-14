import { Component } from "solid-js";
import { useTabCtx } from "./TabProvider";
import { EditableText } from "@gately/shared/ui";
import { useUpdateTabTitle } from "@gately/features/tabs/useUpdateTabTitle";

const TabTitleInput: Component = () => {
    const currTabCtx = useTabCtx();
    const { updateTabTitle } = useUpdateTabTitle();

    return (
        <EditableText
            spanClass="h-8"
            title={() => currTabCtx.tab().title}
            updateTitle={(title) => updateTabTitle(currTabCtx.tab().id, title)}
            isEditing={currTabCtx.isTitleEditing}
            setIsEditing={currTabCtx.setIsTitleEditing}
        />
    );
};

export default TabTitleInput;

