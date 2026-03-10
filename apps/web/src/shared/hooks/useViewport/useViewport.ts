import { batch, untrack } from "solid-js";
import { XYCoords } from "../../types";
import { useDraggable, UseDraggableProps } from "./useDraggable";
import { useZoomable, UseZoomableProps } from "./useZoomable";
import { scaleXYCoords, screenToWorldXYCoords } from "../../lib/math";
import { ZERO_XY_COORDS } from "../../config";

type ViewportEvents = Pick<UseDraggableProps, "onBeginDragging" | "onDragging" | "onEndDragging"> &
    Pick<UseZoomableProps, "onZooming">;

interface IUseViewportProps {
    zoom?: {
        initial?: number;
        min?: number;
        max?: number;
        sensibility?: number;
    };
    drag?: {
        initial: XYCoords;
        min?: XYCoords;
        max?: XYCoords;
    };
    events?: Partial<ViewportEvents>;
}

export const useViewport = (props: IUseViewportProps = {}) => {
    const zoomCore = useZoomable({
        initialZoom: props.zoom?.initial,
        minZoom: props.zoom?.min,
        maxZoom: props.zoom?.max,
        onZooming: props.events?.onZooming,
    });

    const dragCore = useDraggable({
        initialPos: props.drag?.initial,
        minPos: props.drag?.min,
        maxPos: props.drag?.max,
        onBeginDragging: props.events?.onBeginDragging,
        onDragging: props.events?.onDragging,
        onEndDragging: props.events?.onEndDragging,
    });

    function zoomAtPoint(screenTargetPos: XYCoords, factor: number): void {
        const [currScale, currElemPos] = untrack(() => [zoomCore.scale(), dragCore.position()]);
        const newScale = zoomCore.clampScale(zoomCore.scale() * factor);

        if (currScale === newScale) return;

        const worldTargetPos = screenToWorldXYCoords(screenTargetPos, currElemPos);

        const deltaFactor = newScale / currScale - 1;
        const elemPosOffset = scaleXYCoords(worldTargetPos, -deltaFactor);

        batch(() => {
            zoomCore.zoomTo(newScale);
            dragCore.dragBy(elemPosOffset);
        });
    }

    function reset(): void {
        batch(() => {
            dragCore.reset();
            zoomCore.reset();
        });
    }

    function zoomIn(factor: number = 1.1, centerPos: XYCoords = ZERO_XY_COORDS): void {
        const currScale = untrack(() => zoomCore.scale());
        zoomAtPoint(centerPos, currScale * factor);
    }

    function zoomOut(factor: number = 1.1, centerPos: XYCoords = ZERO_XY_COORDS): void {
        const currScale = untrack(() => zoomCore.scale());
        zoomAtPoint(centerPos, currScale / factor);
    }

    return {
        state: {
            position: dragCore.position,
            scale: zoomCore.scale,
            isDragging: dragCore.isDragging,
            reset,
        },
        drag: {
            begin: dragCore.begin,
            end: dragCore.end,
            toPoint: dragCore.dragTo,
            byOffset: dragCore.dragBy,
            reset: dragCore.reset,
        },
        zoom: {
            in: zoomIn,
            out: zoomOut,
            atPoint: zoomAtPoint,
            reset: zoomCore.reset,
            by: zoomCore.zoomBy,
        },
        options: {
            drag: dragCore.options,
            zoom: { sensibility: props.zoom?.sensibility ?? 0.001, ...zoomCore.options },
        },
    };
};

