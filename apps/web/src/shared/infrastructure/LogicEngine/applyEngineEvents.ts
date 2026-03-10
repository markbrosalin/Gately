import type { Graph } from "@antv/x6";
import { toArray } from "@cnbn/utils";
import type { LogicValue } from "@cnbn/schema";
import type { PinUpdate as UIPinUpdate } from "@gately/shared/infrastructure/ui-engine/model";
import type { EnginePinEvent } from "@gately/shared/types";

type ApplyEngineEventsOptions = {
    applyPinUpdates?: (updates: UIPinUpdate[]) => void;
    graph?: Graph;
};

type EngineEventLike =
    | EnginePinEvent
    | EnginePinEvent[]
    | { inputEvents?: EnginePinEvent | EnginePinEvent[] }
    | { outputEvents?: EnginePinEvent | EnginePinEvent[] }
    | { updatesPerBatch?: EnginePinEvent | EnginePinEvent[] }
    | { events?: EnginePinEvent | EnginePinEvent[] };

type PinEvent = EnginePinEvent & {
    kind?: "input" | "output";
    itemId?: string;
    pin?: string;
    value?: LogicValue;
};

const isPinEvent = (v: unknown): v is PinEvent => {
    if (!v || typeof v !== "object") return false;
    const ev = v as PinEvent;
    if (!ev.kind || (ev.kind !== "input" && ev.kind !== "output")) return false;
    if (typeof ev.itemId !== "string" || typeof ev.pin !== "string") return false;
    return "value" in ev;
};

const extractRawEvents = (raw: EngineEventLike | unknown): unknown[] => {
    if (raw == null) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "object") {
        const obj = raw as {
            inputEvents?: unknown;
            outputEvents?: unknown;
            updatesPerBatch?: unknown;
            events?: unknown;
        };

        if (obj.inputEvents != null) {
            return toArray(obj.inputEvents as EnginePinEvent | EnginePinEvent[]);
        }

        if (obj.outputEvents != null) {
            return toArray(obj.outputEvents as EnginePinEvent | EnginePinEvent[]);
        }

        if (obj.events != null) {
            return toArray(obj.events as EnginePinEvent | EnginePinEvent[]);
        }

        if (obj.updatesPerBatch != null) {
            return toArray(obj.updatesPerBatch as EnginePinEvent | EnginePinEvent[]);
        }
    }
    return [raw];
};

const flatten = (arr: unknown[]): unknown[] =>
    arr.flatMap((v) => (Array.isArray(v) ? v : [v]));

export const applyEngineEvents = (
    opts: ApplyEngineEventsOptions,
    raw: EngineEventLike | unknown,
): void => {
    const { applyPinUpdates, graph } = opts;
    if (!applyPinUpdates) return;

    const events = flatten(extractRawEvents(raw)).filter(isPinEvent);
    if (!events.length) return;

    const updates: UIPinUpdate[] = events.map((ev) => ({
        elementId: ev.itemId!,
        pinRef: {
            side: ev.kind === "output" ? "output" : "input",
            index: ev.pin!,
        },
        value: ev.value as LogicValue,
    }));

    if (!updates.length) return;

    if (graph) (graph as unknown as { __bridgeSilent?: boolean }).__bridgeSilent = true;
    try {
        applyPinUpdates(updates);
    } finally {
        if (graph) (graph as unknown as { __bridgeSilent?: boolean }).__bridgeSilent = false;
    }
};

