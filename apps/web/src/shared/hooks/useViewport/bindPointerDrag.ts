import { MouseButton } from "../../enum";
import { getDivLocalPoint } from "../../lib/DOM";
import { isMouseButton } from "../../lib/whatButtonClicked";
import { XYCoords } from "../../types";

interface BindPointerPanProps {
    element: HTMLDivElement;
    button?: MouseButton;
    onBegin?: (point: XYCoords) => void;
    onMove?: (point: XYCoords, delta: XYCoords) => void;
    onEnd?: (point: XYCoords) => void;
}

export const bindPointerDrag = (props: BindPointerPanProps) => {
    const mouseBtn = props.button ?? MouseButton.LEFT;

    const down = (e: PointerEvent) => {
        if (!isMouseButton(e, mouseBtn)) return;

        props.element.setPointerCapture(e.pointerId);
        const point = getDivLocalPoint(props.element, e.clientX, e.clientY);

        props.onBegin?.(point);

        handlePointerDown();
    };

    const move = (e: PointerEvent) => {
        if (!props.element.hasPointerCapture(e.pointerId)) return;
        const point = getDivLocalPoint(props.element, e.clientX, e.clientY);
        const delta = { x: e.movementX, y: e.movementY };

        props.onMove?.(point, delta);
    };

    const up = (e: PointerEvent) => {
        if (!props.element.hasPointerCapture(e.pointerId)) return;

        props.element.releasePointerCapture(e.pointerId);
        const point = getDivLocalPoint(props.element, e.clientX, e.clientY);

        props.onEnd?.(point);

        handlePointerUp();
    };

    function handlePointerDown() {
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
        window.addEventListener("pointercancel", up);
    }

    function handlePointerUp() {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
    }

    props.element.addEventListener("pointerdown", down);

    return () => {
        props.element.removeEventListener("pointerdown", down);
        handlePointerUp();
    };
};

