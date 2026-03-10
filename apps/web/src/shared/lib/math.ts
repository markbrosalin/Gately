import { XYCoords } from "../types";

export const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
};

export const deltaXY = (start: XYCoords, end: XYCoords): XYCoords => {
    return {
        x: end.x - start.x,
        y: end.y - start.y,
    };
};

export const addOffsetXY = (coords: XYCoords, offset: XYCoords): XYCoords => {
    return {
        x: coords.x + offset.x,
        y: coords.y + offset.y,
    };
};

export const screenToWorldXYCoords = (screenCoords: XYCoords, offset: XYCoords): XYCoords => {
    return deltaXY(offset, screenCoords);
};

export const scaleXYCoords = (coords: XYCoords, factor: number) => {
    return {
        x: coords.x * factor,
        y: coords.y * factor,
    };
};

