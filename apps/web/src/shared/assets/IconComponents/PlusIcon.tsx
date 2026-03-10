import { Component } from "solid-js";

interface PlusIconProps {
    size?: number;
}

export const PlusIcon: Component<PlusIconProps> = (props) => {
    return (
        <svg
            fill="currentColor"
            height={props.size ?? 12}
            width={props.size ?? 12}
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M5 0V5H0V7H5V12H7V7H12V5H7V0H5Z" />
        </svg>
    );
};

