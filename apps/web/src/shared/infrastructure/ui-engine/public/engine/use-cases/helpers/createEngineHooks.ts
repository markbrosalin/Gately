import type { UIEngineErrorEvent, UIEngineHooks, UIEngineLifecycleEvent } from "@engine-model";

export const createEngineHooks = (hooks?: UIEngineHooks) => {
    const emitLifecycle = (event: UIEngineLifecycleEvent): void => {
        hooks?.onLifecycle?.(event);
    };

    const reportError = (event: UIEngineErrorEvent): void => {
        hooks?.onError?.(event);
    };

    return {
        emitLifecycle,
        reportError,
    };
};
