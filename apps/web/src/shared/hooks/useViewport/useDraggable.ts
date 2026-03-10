import { batch, createSignal, untrack } from "solid-js";
import { XYCoords } from "../../types";
import { INFINITY_XY_COORDS, NEGATIVE_INFINITY_XY_COORDS, ZERO_XY_COORDS } from "../../config";
import { addOffsetXY, clamp, deltaXY } from "../../lib/math";

export interface UseDraggableProps {
    initialPos?: XYCoords;
    maxPos?: XYCoords;
    minPos?: XYCoords;

    onBeginDragging?: (pos: XYCoords) => void;
    onDragging?: (pos: XYCoords, delta: XYCoords) => void;
    onEndDragging?: (pos: XYCoords) => void;
}

export const useDraggable = ({
    initialPos = ZERO_XY_COORDS,
    maxPos = INFINITY_XY_COORDS,
    minPos = NEGATIVE_INFINITY_XY_COORDS,
    onBeginDragging,
    onDragging,
    onEndDragging,
}: UseDraggableProps = {}) => {
    let startScreenPos: XYCoords | null = null;

    const [position, setPosition] = createSignal(ZERO_XY_COORDS);
    const [isDragging, setIsDragging] = createSignal(false);

    dragTo(initialPos);

    function begin(screenTargetPos: XYCoords): void {
        batch(() => {
            setIsDragging(true);
            startScreenPos = screenTargetPos;
            onBeginDragging?.(screenTargetPos);
        });
    }

    function end(): void {
        batch(() => {
            setIsDragging(false);
            startScreenPos = null;
            onEndDragging?.(position());
        });
    }

    function dragBy(offset: XYCoords): void {
        console.log("hrer");
        const currentPos = untrack(position);

        const nextPos = addOffsetXY(currentPos, offset);

        const clampedPos = clampOffset(nextPos);

        batch(() => {
            setPosition(clampedPos);
            onDragging?.(clampedPos, offset);
        });
    }

    function dragTo(worldTargetPos: XYCoords): void {
        const currentPos = untrack(position);

        const delta = deltaXY(currentPos, worldTargetPos);
        const nextPos = addOffsetXY(currentPos, delta);

        const clampedPos = clampOffset(nextPos);

        batch(() => {
            setPosition(clampedPos);
            if (startScreenPos) startScreenPos = clampedPos;
            onDragging?.(clampedPos, delta);
        });
    }

    function clampOffset(offset: XYCoords): XYCoords {
        return {
            x: clamp(offset.x, minPos.x, maxPos.x),
            y: clamp(offset.y, minPos.y, maxPos.y),
        };
    }

    function reset(): void {
        setPosition(initialPos);
    }

    return {
        reset,
        clampOffset,
        position,
        isDragging,
        begin,
        dragTo,
        dragBy,
        end,
        options: {
            initialPos,
            minPos,
            maxPos,
        },
    };
};

