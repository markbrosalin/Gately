import { SimInputEvent, SimOutputEvent } from "@cnbn/engine";

export type Direction = "right" | "top" | "left" | "bottom";
export type Axis = "x" | "y";
export type Language = "ru" | "en";
export type Theme = "light" | "dark";

export type PartialExceptId<T extends { id: string }> = Partial<Omit<T, "id">>;

export type XYCoords = { x: number; y: number };
export type ScaleFactor = number;
export type XYOffset = { dx: number; dy: number };
export type WorkspaceSimulationMode = "instant" | "0.5sec";

export type EnginePinEvent = SimInputEvent | SimOutputEvent;
export type EngineSignalEvent = Pick<EnginePinEvent, "itemId" | "pin" | "value" | "kind">;

