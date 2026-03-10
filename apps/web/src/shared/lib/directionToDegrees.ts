import { Direction } from "../types";

export const directionToDegrees = (direction: Direction) => {
    return {
        right: "0deg",
        left: "180deg",
        top: "-90deg",
        bottom: "90deg",
    }[direction];
};

