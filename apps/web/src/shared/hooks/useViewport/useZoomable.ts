import { batch, createSignal } from "solid-js";
import { clamp } from "../../lib/math";

export interface UseZoomableProps {
    initialZoom?: number;
    minZoom?: number;
    maxZoom?: number;
    onZooming?: (scale: number) => void;
}

export const useZoomable = ({
    initialZoom = 1,
    minZoom = 0.1,
    maxZoom = 4,
    onZooming,
}: UseZoomableProps = {}) => {
    const [scale, setScale] = createSignal(initialZoom);

    function zoomBy(factor: number): void {
        zoomTo(scale() * factor);
    }

    function zoomTo(scale: number): void {
        const newScale = clampScale(scale);

        batch(() => {
            onZooming?.(newScale);
            setScale(newScale);
        });
    }

    function clampScale(scale: number): number {
        return clamp(scale, minZoom, maxZoom);
    }

    function reset(): void {
        setScale(initialZoom);
    }

    return {
        clampScale,
        scale,
        zoomBy,
        zoomTo,
        reset,
        options: {
            minZoom,
            maxZoom,
            initialZoom,
        },
    };
};

