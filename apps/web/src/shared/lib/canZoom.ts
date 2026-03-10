interface ZoomLimits {
    min: number;
    max: number;
}

/**
 * @param deltaY - дельта прокрутки по Y (e.deltaY).
 * @param currValue  - текущее значение.
 * @param min    - минимально допустимое значение.
 * @param max    - максимально допустимое значение.
 */
export function canZoom(deltaY: number, currValue: number, { min, max }: ZoomLimits): boolean {
    return (deltaY < 0 && currValue < max) || (deltaY > 0 && currValue > min);
}

