import { MouseButton } from "@gately/shared/enum";
import { bindPointerDrag } from "./bindPointerDrag";
import { bindWheelZoom } from "./bindWheelZoom";
import { useViewport } from "./useViewport";

export const useViewportBinding = ({ drag, zoom, options }: ReturnType<typeof useViewport>) => {
    function bindDrag(element: HTMLDivElement) {
        return bindPointerDrag({
            element,
            button: MouseButton.MIDDLE,
            onBegin: (point) => drag.begin(point),
            onMove: (_, delta) => drag.byOffset(delta),
            onEnd: () => drag.end(),
        });
    }

    function bindZoom(element: HTMLDivElement) {
        return bindWheelZoom({
            element,
            onZooming: (point, deltaY) => {
                const factor = Math.exp(-deltaY * options.zoom.sensibility);
                zoom.atPoint(point, factor);
            },
        });
    }

    return { bindDrag, bindZoom };
};

