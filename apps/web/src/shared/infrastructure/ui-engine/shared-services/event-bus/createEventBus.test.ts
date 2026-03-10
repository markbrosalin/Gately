import { describe, expect, it, vi } from "vitest";
import { createEventBus } from "./index";

describe("createEventBus", () => {
    it("subscribes, emits, unsubscribes and supports once listeners", () => {
        const onLifecycle = vi.fn();
        const bus = createEventBus({
            onLifecycle,
        }).scope("workspace");
        const listener = vi.fn();
        const onceListener = vi.fn();

        const off = bus.on("simulation:batch-applied", listener);
        bus.once("simulation:batch-applied", onceListener);

        bus.emit("simulation:batch-applied", {
            updates: [],
        });
        bus.emit("simulation:batch-applied", {
            updates: [],
        });

        off();
        bus.emit("simulation:batch-applied", {
            updates: [],
        });

        expect(listener).toHaveBeenCalledTimes(2);
        expect(onceListener).toHaveBeenCalledTimes(1);
        expect(onLifecycle).toHaveBeenNthCalledWith(1, {
            type: "event-bus:reader-registered",
            owner: "workspace",
            event: "simulation:batch-applied",
        });
        expect(onLifecycle).toHaveBeenNthCalledWith(2, {
            type: "event-bus:reader-registered",
            owner: "workspace",
            event: "simulation:batch-applied",
        });
        expect(onLifecycle).toHaveBeenNthCalledWith(3, {
            type: "event-bus:writer-emitted",
            owner: "workspace",
            event: "simulation:batch-applied",
        });
        expect(onLifecycle).toHaveBeenNthCalledWith(4, {
            type: "event-bus:reader-removed",
            owner: "workspace",
            event: "simulation:batch-applied",
        });
        expect(onLifecycle).toHaveBeenNthCalledWith(5, {
            type: "event-bus:writer-emitted",
            owner: "workspace",
            event: "simulation:batch-applied",
        });
        expect(onLifecycle).toHaveBeenNthCalledWith(6, {
            type: "event-bus:reader-removed",
            owner: "workspace",
            event: "simulation:batch-applied",
        });
        expect(onLifecycle).toHaveBeenNthCalledWith(7, {
            type: "event-bus:writer-emitted",
            owner: "workspace",
            event: "simulation:batch-applied",
        });
    });
});


