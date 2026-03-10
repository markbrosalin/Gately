import { XYCoords } from "../types";
import { deltaXY } from "./math";

export const getDivLocalPoint = (
    el: HTMLDivElement,
    clientX: number,
    clientY: number,
): XYCoords => {
    const rect = el.getBoundingClientRect();
    return deltaXY({ x: rect.left, y: rect.top }, { x: clientX, y: clientY });
};

