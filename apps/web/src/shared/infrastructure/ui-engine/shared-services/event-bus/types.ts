import type {
    UIEngineEventListener,
    UIEngineEventMap,
    UIEngineEventName,
} from "../../model/events";

export type EventBusHandleContract = {
    emit: <K extends UIEngineEventName>(name: K, event: UIEngineEventMap[K]) => void;
    on: <K extends UIEngineEventName>(name: K, listener: UIEngineEventListener<K>) => () => void;
    once: <K extends UIEngineEventName>(name: K, listener: UIEngineEventListener<K>) => () => void;
    off: <K extends UIEngineEventName>(name: K, listener: UIEngineEventListener<K>) => void;
};

export type EventBusServiceContract = EventBusHandleContract & {
    scope: (owner: string) => EventBusHandleContract;
};

