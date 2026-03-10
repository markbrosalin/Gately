import { getDivLocalPoint } from "../../lib/DOM";
import { XYCoords } from "../../types";

export const bindWheelZoom = (props: {
    element: HTMLDivElement;
    onZooming?: (point: XYCoords, deltaY: number) => void;
}) => {
    const wheel = (e: WheelEvent) => {
        e.preventDefault();
        const point = getDivLocalPoint(props.element, e.clientX, e.clientY);

        props.onZooming?.(point, e.deltaY);
    };

    props.element.addEventListener("wheel", wheel, { passive: false });

    return () => {
        props.element.removeEventListener("wheel", wheel);
    };
};

