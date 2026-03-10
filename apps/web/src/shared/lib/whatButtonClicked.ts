import { MouseButton } from "../enum";

export const isLeftButton = (e: MouseEvent) => e.button === 0;

export const isMiddleButton = (e: MouseEvent) => e.button === 1;

export const isRightButton = (e: MouseEvent) => e.button === 2;

export const isEnterClicked = (e: KeyboardEvent) => e.key === "Enter";

export const isEscapeClicked = (e: KeyboardEvent) => e.key === "Escape";

export const isMouseButton = (e: MouseEvent | PointerEvent, button: MouseButton) => {
    switch (button) {
        case MouseButton.ANY:
            return true;
        case MouseButton.LEFT:
            return isLeftButton(e);
        case MouseButton.MIDDLE:
            return isMiddleButton(e);
        case MouseButton.RIGHT:
            return isRightButton(e);
        default:
            return false;
    }
};

