export const isPortMagnet = (magnet?: Element | null): boolean =>
    Boolean(magnet && magnet.getAttribute("magnet") === "true");

