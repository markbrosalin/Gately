import { describe, expect, it, vi } from "vitest";
import { createEventBus } from "../../shared-services/event-bus";
import { createUninitializedGetter } from "./helper";
import { createComponentRegistry } from "./createComponentRegistry";

describe("createComponentRegistry", () => {
    it("emits lifecycle and injects scoped shared services", () => {
        const onLifecycle = vi.fn();
        const eventBus = createEventBus({
            onLifecycle,
        });
        const registry = createComponentRegistry({
            external: {
                hooks: {
                    onLifecycle,
                },
            },
            getSharedService: ((name: "eventBus" | "snapshotHub") => {
                if (name === "eventBus") return eventBus;
                return {} as never;
            }) as never,
            getService: createUninitializedGetter("Test"),
        });

        const component = registry.register("workspace", ({ getSharedService }) => {
            getSharedService("eventBus").emit("simulation:batch-applied", {
                updates: [],
            });

            return { ok: true };
        });

        expect(component).toEqual({ ok: true });
        expect(onLifecycle).toHaveBeenNthCalledWith(1, {
            type: "event-bus:writer-emitted",
            owner: "workspace",
            event: "simulation:batch-applied",
        });
        expect(onLifecycle).toHaveBeenNthCalledWith(2, {
            type: "component:created",
            name: "workspace",
        });
    });
});


