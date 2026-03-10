import { directionToDegrees } from "@gately/shared/lib/directionToDegrees";
import { Direction } from "@gately/shared/types";
import { Component } from "solid-js";

interface ArrowIconProps {
    direction: Direction;
    size?: number;
    rotate?: number;
}

export const ArrowIcon: Component<ArrowIconProps> = (props) => {
    const direction = props.direction;
    const rotation = directionToDegrees(direction);

    const PATH_DEFAULT = SCROLL_RIGHT;

    return (
        <svg
            fill="currentColor"
            width={props.size ?? 12}
            height={props.size ?? 12}
            viewBox="0 0 8 12"
            xmlns="http://www.w3.org/2000/svg"
            style={{ rotate: rotation }}
        >
            <path d={PATH_DEFAULT} />
        </svg>
    );
};

// const SCROLL_LEFT =
//     "M6.41 12.0025C6.15 12.0025 5.9 11.9025 5.7 11.7125L0 6.0025L5.71 0.2925C6.1 -0.0975 6.73 -0.0975 7.12 0.2925C7.51 0.6825 7.51 1.3125 7.12 1.7025L2.83 6.0025L7.12 10.2925C7.51 10.6825 7.51 11.3125 7.12 11.7025C6.92 11.9025 6.67 11.9925 6.41 11.9925V12.0025Z";
const SCROLL_RIGHT =
    "M1.00006 12.0001C0.740059 12.0001 0.490059 11.9001 0.290059 11.7101C-0.0999414 11.3201 -0.0999414 10.6901 0.290059 10.3001L4.58006 6.01006L0.290059 1.71006C-0.0999414 1.32006 -0.0999414 0.680059 0.290059 0.290059C0.680059 -0.0999414 1.32006 -0.0999414 1.71006 0.290059L7.42006 6.00006L1.71006 11.7101C1.51006 11.9101 1.26006 12.0001 1.00006 12.0001Z";

