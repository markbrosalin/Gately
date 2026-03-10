import { PinRef, PortSide } from "../../model";

export const encodePortId = (config: { side: PortSide; id: string }): string => {
    const sideCode = config.side === "left" ? "L" : "R";
    return `${sideCode}:${config.id}`;
};

export const decodePortId = (portId: string): { side: PortSide; id: string } => {
    const [sideCode, id] = portId.split(":");
    const side = sideCode === "R" ? "right" : "left";
    return { side, id: id ?? portId };
};

export const pinRefToPortId = (pinRef: PinRef): string =>
    encodePortId({
        side: pinRef.side === "input" ? "left" : "right",
        id: pinRef.index,
    });

export const portIdToPinRef = (portId: string): PinRef => {
    const { side, id } = decodePortId(portId);
    return { side: side === "left" ? "input" : "output", index: id };
};

