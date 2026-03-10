import { Accessor, Component, createSignal, onMount } from "solid-js";

interface AutoWidthInputProps {
    class?: string;
    value?: Accessor<string>;
    onBlur?: (e: FocusEvent & { currentTarget: HTMLInputElement }) => void;
    onKeyDown?: (e: KeyboardEvent & { currentTarget: HTMLInputElement }) => void;
    onClick?: (e: MouseEvent) => void;
    inputRef?: (el: HTMLInputElement) => void;
    maxLength?: number;
    minLength?: number;
}

const AutoWidthInput: Component<AutoWidthInputProps> = (props) => {
    const [value, setValue] = createSignal(props.value?.());

    let inputRef: HTMLInputElement | undefined;
    let spanRef: HTMLSpanElement | undefined;

    const updateWidth = () => {
        if (inputRef && spanRef) {
            spanRef.textContent = value() || "";
            const width = spanRef.offsetWidth;
            inputRef.style.width = `${width}px`;
        }
    };

    onMount(updateWidth);

    return (
        <div class="relative inline-block">
            {/* Скрытый измеритель */}
            <span
                ref={spanRef}
                class={`absolute left-0 top-0 invisible font-bold-main whitespace-pre pointer-events-none
                ${props.class}`}
            >
                {value() || ""}
            </span>

            {/* Видимый input */}
            <input
                ref={(el) => {
                    inputRef = el;
                    props.inputRef?.(el);
                }}
                class={`bg-transparent border-none outline-none w-full ${props.class}`}
                value={value()}
                oninput={(e) => {
                    setValue(e.currentTarget.value);
                    updateWidth();
                }}
                onblur={props.onBlur}
                onkeydown={props.onKeyDown}
                onclick={props.onClick}
                maxLength={props.maxLength}
                minLength={props.minLength}
            />
        </div>
    );
};

export default AutoWidthInput;

