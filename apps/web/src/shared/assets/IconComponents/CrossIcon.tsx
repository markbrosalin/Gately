import { Component } from "solid-js";

interface CrossIconProps {
    size?: number;
}

export const CrossIcon: Component<CrossIconProps> = (props) => {
    return (
        <svg
            fill="currentColor"
            viewBox={`0 0 10 10`}
            height={props.size ?? 8}
            width={props.size ?? 8}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d={PATH_DEFAULT} />
        </svg>
    );
};

const PATH_DEFAULT =
    "M0.828427 2.17157L3.65685 5L0.828427 7.82843L2.24264 9.24264L5.07107 6.41421L7.89949 9.24264L9.31371 7.82843L6.48528 5L9.31371 2.17157L7.89949 0.757359L5.07107 3.58579L2.24264 0.757359L0.828427 2.17157Z";

