import { createContext, ParentComponent, useContext } from "solid-js";
import { createUIEngine } from "./engine";
import type { EnginePublicApi } from "./types";
import type { UIEngineExternalContext } from "../model";

const UIEngineContext = createContext<EnginePublicApi>();

export const UIEngineProvider: ParentComponent<{ ctx?: UIEngineExternalContext }> = (props) => {
    const engine = createUIEngine(props.ctx ?? {});

    const value: EnginePublicApi = {
        mount: engine.mount,
        query: engine.query,
        api: engine.api,
    };

    return <UIEngineContext.Provider value={value}>{props.children}</UIEngineContext.Provider>;
};

export const useUIEngine = () => {
    const ctx = useContext(UIEngineContext);
    if (!ctx) throw new Error("useUIEngine must be used within UIEngineProvider");
    return ctx;
};
