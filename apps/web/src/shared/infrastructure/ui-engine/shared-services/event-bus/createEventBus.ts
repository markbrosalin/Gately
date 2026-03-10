import type { UIEngineHooks } from "../../model";
import type { UIEngineEventListener, UIEngineEventMap, UIEngineEventName } from "../../model/events";
import type { EventBusHandleContract, EventBusServiceContract } from "./types";

type AnyListener = (event: unknown) => void;

export const createEventBus = (hooks?: UIEngineHooks): EventBusServiceContract => {
    const listeners = new Map<UIEngineEventName, Set<AnyListener>>();

    const on = <K extends UIEngineEventName>(
        owner: string,
        name: K,
        listener: UIEngineEventListener<K>,
    ): (() => void) => {
        const existing = listeners.get(name);
        const set = existing ?? new Set<AnyListener>();
        set.add(listener as AnyListener);

        if (!existing) {
            listeners.set(name, set);
        }

        hooks?.onLifecycle?.({
            type: "event-bus:reader-registered",
            owner,
            event: name,
        });

        return () => {
            off(owner, name, listener);
        };
    };

    const once = <K extends UIEngineEventName>(
        owner: string,
        name: K,
        listener: UIEngineEventListener<K>,
    ): (() => void) => {
        const off_fn = on(owner, name, (event) => {
            off_fn();
            listener(event);
        });

        return off_fn;
    };

    const off = <K extends UIEngineEventName>(
        owner: string,
        name: K,
        listener: UIEngineEventListener<K>,
    ): void => {
        const set = listeners.get(name);
        if (!set) return;

        const isRemoved = set.delete(listener as AnyListener);
        if (!isRemoved) return;

        hooks?.onLifecycle?.({
            type: "event-bus:reader-removed",
            owner,
            event: name,
        });

        if (!set.size) {
            listeners.delete(name);
        }
    };

    const emit = <K extends UIEngineEventName>(
        owner: string,
        name: K,
        event: UIEngineEventMap[K],
    ): void => {
        hooks?.onLifecycle?.({
            type: "event-bus:writer-emitted",
            owner,
            event: name,
        });

        const set = listeners.get(name);
        if (!set) return;

        set.forEach((listener) => {
            (listener as UIEngineEventListener<K>)(event);
        });
    };

    const createHandle = (owner: string): EventBusHandleContract => ({
        emit: (name, event) => emit(owner, name, event),
        on: (name, listener) => on(owner, name, listener),
        once: (name, listener) => once(owner, name, listener),
        off: (name, listener) => off(owner, name, listener),
    });

    const globalHandle = createHandle("global");

    return {
        ...globalHandle,
        scope: createHandle,
    };
};

