import { createContext, onCleanup, ParentComponent, useContext } from "solid-js";
import { createUIEngine } from "./engine";
import type { UIEnginePublicApi } from "./types";
import type { UIEngineExternalContext } from "../model";

const UIEngineContext = createContext<UIEnginePublicApi>();

export const UIEngineProvider: ParentComponent<{ ctx?: UIEngineExternalContext }> = (props) => {
    const engine = createUIEngine(props.ctx ?? {});

    onCleanup(() => {
        engine.dispose();
    });

    const value: UIEnginePublicApi = {
        mount: engine.mount,
        query: engine.query,
        useCases: engine.useCases,
        debug: engine.debug,
    };

    return <UIEngineContext.Provider value={value}>{props.children}</UIEngineContext.Provider>;
};

export const useUIEngine = () => {
    const ctx = useContext(UIEngineContext);
    if (!ctx) throw new Error("useUIEngine must be used within UIEngineProvider");
    return ctx;
};
