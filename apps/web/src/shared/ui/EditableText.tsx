import { Accessor, Component, createEffect, Setter } from "solid-js";
import AutoWidthInput from "./AutoWidthInput";
import { isEnterClicked, isEscapeClicked } from "../lib/whatButtonClicked";

interface EditableText {
    title: Accessor<string>;
    updateTitle: (title: string) => void;

    isEditing: Accessor<boolean>;
    setIsEditing: Setter<boolean>;

    spanClass?: string;
    inputClass?: string;
}

export const EditableText: Component<EditableText> = (props) => {
    let lastTitle = "";
    let inputRef: HTMLInputElement;

    createEffect(() => {
        if (!props.isEditing()) return;
        lastTitle = props.title();

        queueMicrotask(() => {
            inputRef?.focus();
            inputRef?.select();
        });
    });

    function commitEdit(e: FocusEvent & { currentTarget: HTMLInputElement }) {
        const trimmed = e.currentTarget.value.trim();

        if (trimmed && trimmed !== props.title()) {
            props.updateTitle?.(trimmed);
        }
        props.setIsEditing(false);
    }

    function cancelEdit() {
        if (inputRef) inputRef.value = lastTitle;

        props.setIsEditing(false);
    }

    const handleKeyDown = (e: KeyboardEvent & { currentTarget: HTMLInputElement }) => {
        if (isEnterClicked(e) || isEscapeClicked(e)) {
            if (isEscapeClicked(e)) cancelEdit();
            e.currentTarget.blur();
        }
    };

    return props.isEditing() ? (
        <AutoWidthInput
            value={props.title}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            inputRef={(el) => (inputRef = el)}
            maxLength={40}
            class={props.inputClass}
        />
    ) : (
        <div class={`w-full ${props.spanClass ?? ""}`}>
            <span class="whitespace-nowrap">{props.title()}</span>
        </div>
    );
};

