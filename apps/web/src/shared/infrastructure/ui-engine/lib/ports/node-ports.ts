import type { Node } from "@antv/x6";
import { decodePortId } from "./decode-encode";

export const getPrimaryOutputPin = (node: Node): string | null => {
    const ports = node.getPorts?.() ?? [];

    for (const port of ports) {
        if (!port?.id || typeof port.id !== "string") continue;
        const { side, id } = decodePortId(port.id);
        if (side !== "right") continue;
        return id;
    }

    return null;
};

export const getOutputPortIdByPin = (node: Node, pin: string): string | null => {
    const ports = node.getPorts?.() ?? [];

    for (const port of ports) {
        if (!port?.id || typeof port.id !== "string") continue;
        const decoded = decodePortId(port.id);
        if (decoded.side === "right" && decoded.id === pin) return port.id;
    }

    return null;
};


